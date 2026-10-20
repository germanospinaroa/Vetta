-- Run only after the Vercel Production route is deployed and both Vault
-- secrets exist. This is intentionally separate from migration 0005.
do $$
begin
  if not exists (select 1 from vault.decrypted_secrets where name = 'vetta_delivery_endpoint_url')
     or not exists (select 1 from vault.decrypted_secrets where name = 'vetta_delivery_cron_token') then
    raise exception 'VETTA delivery Vault secrets are missing';
  end if;
  if exists (select 1 from cron.job where jobname = 'vetta-deliver-due-messages') then
    perform cron.unschedule('vetta-deliver-due-messages');
  end if;
  perform cron.schedule(
    'vetta-deliver-due-messages',
    '* * * * *',
    $cron$
      select net.http_post(
        url := (select decrypted_secret from vault.decrypted_secrets where name = 'vetta_delivery_endpoint_url'),
        headers := jsonb_build_object(
          'content-type', 'application/json',
          'x-vetta-cron-token', (select decrypted_secret from vault.decrypted_secrets where name = 'vetta_delivery_cron_token')
        ),
        body := '{"source":"supabase_cron"}'::jsonb
      );
    $cron$
  );
end;
$$;
