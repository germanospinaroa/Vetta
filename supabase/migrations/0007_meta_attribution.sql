-- Preserve ad attribution available at registration time without changing
-- existing lead data. These fields are optional and contain no form answers.
alter table public.campaign_attribution
  add column if not exists fbclid text,
  add column if not exists fbp text,
  add column if not exists fbc text;
