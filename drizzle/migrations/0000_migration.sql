CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  patient_type text NOT NULL,
  service text NOT NULL,
  appointment_date date NOT NULL,
  time_slot text NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX appointments_slot_unique ON public.appointments (appointment_date, time_slot) WHERE status <> 'cancelled';

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_booked_slots(p_date date)
RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT time_slot FROM public.appointments WHERE appointment_date = p_date AND status <> 'cancelled';
$$;

CREATE OR REPLACE FUNCTION public.book_appointment(
  p_full_name text, p_phone text, p_email text, p_patient_type text, p_service text,
  p_date date, p_slot text, p_reason text
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ref text;
BEGIN
  IF length(trim(coalesce(p_full_name,''))) < 2 OR length(p_full_name) > 100 THEN RAISE EXCEPTION 'Invalid name'; END IF;
  IF p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(p_email) > 255 THEN RAISE EXCEPTION 'Invalid email'; END IF;
  IF p_phone !~ '^[0-9+\-\s()]{7,20}$' THEN RAISE EXCEPTION 'Invalid phone'; END IF;
  IF p_patient_type NOT IN ('new','returning') THEN RAISE EXCEPTION 'Invalid patient type'; END IF;
  IF p_date < (now() AT TIME ZONE 'Asia/Kolkata')::date THEN RAISE EXCEPTION 'Date is in the past'; END IF;
  IF p_slot NOT IN ('09:30','10:00','10:30','11:00','11:30','12:00','16:00','16:30','17:00','17:30','18:00','18:30') THEN RAISE EXCEPTION 'Invalid slot'; END IF;
  IF length(coalesce(p_reason,'')) > 500 OR length(p_service) > 100 THEN RAISE EXCEPTION 'Input too long'; END IF;
  ref := 'DP-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
  BEGIN
    INSERT INTO public.appointments(reference, full_name, phone, email, patient_type, service, appointment_date, time_slot, reason)
    VALUES (ref, trim(p_full_name), p_phone, lower(p_email), p_patient_type, p_service, p_date, p_slot, nullif(trim(p_reason),''));
  EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'SLOT_TAKEN';
  END;
  RETURN ref;
END; $$;

CREATE OR REPLACE FUNCTION public.submit_contact(
  p_name text, p_email text, p_phone text, p_subject text, p_message text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF length(trim(coalesce(p_name,''))) < 2 OR length(p_name) > 100 THEN RAISE EXCEPTION 'Invalid name'; END IF;
  IF p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(p_email) > 255 THEN RAISE EXCEPTION 'Invalid email'; END IF;
  IF length(trim(coalesce(p_subject,''))) < 2 OR length(p_subject) > 150 THEN RAISE EXCEPTION 'Invalid subject'; END IF;
  IF length(trim(coalesce(p_message,''))) < 10 OR length(p_message) > 2000 THEN RAISE EXCEPTION 'Invalid message'; END IF;
  INSERT INTO public.contact_messages(name, email, phone, subject, message)
  VALUES (trim(p_name), lower(p_email), nullif(trim(coalesce(p_phone,'')),''), trim(p_subject), trim(p_message));
END; $$;

REVOKE ALL ON FUNCTION public.get_booked_slots(date) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.book_appointment(text,text,text,text,text,date,text,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_contact(text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_booked_slots(date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.book_appointment(text,text,text,text,text,date,text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_contact(text,text,text,text,text) TO anon, authenticated;