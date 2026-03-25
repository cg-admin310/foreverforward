# Stripe Setup Guide - Forever Forward

This guide covers the complete Stripe integration setup for the Forever Forward billing system.

## Current Status

- **API Keys**: Test mode (sk_test_*) - switch to live keys for production
- **Webhook Endpoint**: Registered at `https://foreverforward-xi.vercel.app/api/stripe/webhooks`
- **Billing Portal**: Configured

## Quick Setup Checklist

### 1. Get Your Webhook Secret

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Find or create the endpoint: `https://foreverforward-xi.vercel.app/api/stripe/webhooks`
3. Click on the endpoint
4. Under "Signing secret", click "Reveal" and copy the `whsec_...` value
5. Add to your environment:
   - **Local**: Update `.env.local` → `STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret`
   - **Vercel**: Add to Project Settings > Environment Variables

### 2. Subscribe to Required Events

Edit your webhook endpoint and ensure these events are selected:

**Checkout & Payments:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

**Invoices:**
- `invoice.created`
- `invoice.finalized`
- `invoice.paid`
- `invoice.payment_failed`
- `invoice.marked_uncollectible`

**Subscriptions (Recurring Billing):**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 3. Test Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local dev server
npm run stripe:listen

# In another terminal, run your dev server
npm run dev
```

### 4. Validate Setup

```bash
npm run validate:stripe
```

This will check:
- API key configuration
- Webhook secret
- Webhook endpoint registration
- Event subscriptions
- Billing portal configuration

## Environment Variables

### Required for Billing

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `STRIPE_SECRET_KEY` | API secret key | [API Keys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public API key | [API Keys](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | [Webhooks](https://dashboard.stripe.com/webhooks) |

### Vercel Deployment

Add these to Vercel Project Settings > Environment Variables:
1. `STRIPE_SECRET_KEY`
2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. `STRIPE_WEBHOOK_SECRET`

## Going Live

When ready for production:

1. **Switch API Keys**:
   - Replace `sk_test_...` with `sk_live_...`
   - Replace `pk_test_...` with `pk_live_...`

2. **Create Production Webhook**:
   - Go to [Live Webhooks](https://dashboard.stripe.com/webhooks) (toggle from Test)
   - Create endpoint with same URL and events
   - Get new webhook secret for production

3. **Update Vercel Environment**:
   - Add production keys to Vercel
   - Redeploy

4. **Verify**:
   - Run `npm run validate:stripe`
   - Test a small invoice

## Billing Features

### Invoice Management
- Create draft invoices with line items
- Send invoices via email with payment link
- Track payment status in real-time via webhooks
- Mark invoices as uncollectible

### Recurring Billing
- Enable monthly invoices for MSP clients
- Automatic invoice generation via Stripe subscriptions
- Update monthly amounts

### Customer Portal
- Self-service payment portal for clients
- View and pay open invoices
- Manage payment methods

### Reporting
- Monthly Revenue History
- Billing events audit trail
- CSV export

## Webhook Event Flow

```
Stripe Event → Webhook Handler → Database Update → Activity Log
                    ↓
              webhook_events table (audit)
                    ↓
              billing_events table (per invoice)
```

## Troubleshooting

### Webhook signature verification failed
- Ensure `STRIPE_WEBHOOK_SECRET` matches the endpoint's signing secret
- Check that the secret starts with `whsec_`
- Make sure you're using the correct secret for test vs live mode

### Invoice not syncing
- Check webhook_events table for errors
- Verify all invoice.* events are subscribed
- Check Vercel function logs

### Missing billing events
- Run `npm run validate:stripe` to check event subscriptions
- Add missing events in Stripe dashboard

## Support

- Stripe Docs: https://stripe.com/docs
- Stripe CLI: https://stripe.com/docs/stripe-cli
- Dashboard: https://dashboard.stripe.com
