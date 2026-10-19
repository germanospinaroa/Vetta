create unique index if not exists leads_cohort_whatsapp_unique_idx
  on public.leads(cohort_id, whatsapp_e164);
