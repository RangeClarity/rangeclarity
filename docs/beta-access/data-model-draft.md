# Paid Beta Data Model Draft

## User / BetaLead

| Field | Type | Notes |
|---|---|---|
| id | string | Internal ID. |
| name | string | User name. |
| email | string | Primary contact. |
| tradingViewUsername | string or null | Exact TradingView username. |
| hasTradingViewAccount | boolean or null | Whether user already has TradingView. |
| marketFocus | string or null | Stocks, crypto, or other focus. |
| paymentStatus | string | `none`, `payment_pending`, `test_paid`, `failed`, `cancelled`, `refunded`. |
| accessStatus | string | `lead`, `registered`, `access_pending`, `access_granted`, `access_revoked`. |
| plan | string | Example: `paid_beta`. |
| source | string or null | X, outreach, referral, direct, unknown. |
| notes | string or null | User-submitted notes. |
| adminNotes | string or null | Founder/admin notes. |
| createdAt | datetime | Created timestamp. |
| updatedAt | datetime | Updated timestamp. |

## Payment

| Field | Type | Notes |
|---|---|---|
| id | string | Internal payment record ID. |
| userId | string | Links to User/BetaLead. |
| provider | string | `manual`, `stripe_sandbox`, `paddle_sandbox`, `lemon_squeezy_sandbox`, etc. |
| providerCustomerId | string or null | Provider customer ID if available. |
| providerPaymentId | string or null | Provider payment/session ID if available. |
| status | string | `pending`, `test_paid`, `failed`, `cancelled`, `refunded`. |
| amount | number | Amount in smallest practical unit or decimal, to be defined before implementation. |
| currency | string | Example: `USD`. |
| createdAt | datetime | Created timestamp. |

## Feedback

| Field | Type | Notes |
|---|---|---|
| id | string | Internal feedback ID. |
| userId | string | Links to User/BetaLead. |
| rating | number or null | Optional rating. |
| comment | string or null | General feedback. |
| bugReport | string or null | Bug details. |
| requestedFeature | string or null | Requested improvement. |
| createdAt | datetime | Created timestamp. |

## Notes

- Keep this model simple for beta.
- Do not build a complex backend before the manual beta path is proven.
- Payment provider fields should remain nullable until a provider is selected.
- Access is manually granted in TradingView during beta.
