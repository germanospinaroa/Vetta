# VETTA support email

The route `/api/webhooks/resend` accepts only signed `email.received` events whose recipient includes `support@gritlab.pro`. It uses Resend's receiving forward operation to send the original message, body, and attachments to `germanospinaroa@gmail.com` from `support@gritlab.pro`.

Required server-only variables:

- `RESEND_API_KEY`
- `RESEND_WEBHOOK_SECRET`

Apply `supabase/migrations/0002_support_email_events.sql` to the authorized VETTA Supabase project before enabling the webhook. The table has RLS enabled and is accessed only with the server service-role key. It stores event/email IDs and forwarding status, not message bodies or attachments.

In Resend, create one webhook for:

```text
https://noemprendas.gritlab.pro/api/webhooks/resend
```

Select only `email.received`, then copy its signing secret to `RESEND_WEBHOOK_SECRET`. Do not put either variable in `NEXT_PUBLIC_*` or the repository.

The authenticated route `/api/support/reply` sends an operator-approved reply from `support@gritlab.pro`. It accepts only `to`, `subject`, and `text`, and requires a VETTA admin session. It does not expose the Gmail destination.
