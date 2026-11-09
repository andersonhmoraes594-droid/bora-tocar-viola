CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  author_name text NOT NULL DEFAULT '',
  question text NOT NULL CHECK (char_length(question) BETWEEN 3 AND 2000),
  answer text,
  answered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alunos veem dúvidas" ON public.questions FOR SELECT TO authenticated
  USING (public.is_member(auth.uid()));
CREATE POLICY "Aluno pergunta" ON public.questions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_member(auth.uid()));
CREATE POLICY "Professor responde" ON public.questions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Aluno apaga a própria dúvida" ON public.questions FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX questions_created_at_idx ON public.questions (created_at DESC);

-- Nome do autor vem da conta; aluno não consegue responder a própria dúvida.
CREATE OR REPLACE FUNCTION public.questions_before_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  meta jsonb;
  mail text;
BEGIN
  SELECT raw_user_meta_data, email INTO meta, mail FROM auth.users WHERE id = NEW.user_id;
  NEW.author_name := COALESCE(NULLIF(trim(meta->>'nome'), ''), split_part(COALESCE(mail, 'Aluno'), '@', 1));
  IF NOT public.has_role(NEW.user_id, 'admin') THEN
    NEW.answer := NULL;
    NEW.answered_at := NULL;
  END IF;
  NEW.created_at := now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER questions_before_insert BEFORE INSERT ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.questions_before_insert();

CREATE OR REPLACE FUNCTION public.questions_before_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.user_id := OLD.user_id;
  NEW.author_name := OLD.author_name;
  NEW.created_at := OLD.created_at;
  IF NEW.answer IS DISTINCT FROM OLD.answer THEN
    NEW.answered_at := CASE WHEN NULLIF(trim(COALESCE(NEW.answer, '')), '') IS NULL THEN NULL ELSE now() END;
    IF NEW.answered_at IS NULL THEN NEW.answer := NULL; END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER questions_before_update BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.questions_before_update();

REVOKE EXECUTE ON FUNCTION public.questions_before_insert() FROM PUBLIC, anon, authenticated;