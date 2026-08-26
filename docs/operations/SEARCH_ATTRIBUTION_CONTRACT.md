# Search and AI Attribution Contract

Status: implementation candidate; external workflow and CRM mapping require human approval before production deployment.

## Measurement boundary

Brunova separates three measurement concerns:

1. Search performance belongs in Google Search Console and, secondarily, Bing Webmaster Tools.
2. Commercial attribution connects a first discovery touch to contact submission and the resulting HubSpot sales record.
3. General product analytics is deferred. The website continues to use its no-operation analytics adapter.

The website does not fingerprint visitors, create cross-device identifiers, set analytics cookies or retain arbitrary external query parameters.

## Browser first-touch record

The current browser session stores one first-touch record under `brunova:first-touch-attribution:v2`:

- `firstReferrerHost`: hostname only; no full referrer URL, path or query;
- `firstLandingPath`: Brunova pathname only; no query or fragment;
- `firstLandingLocale`: `en` or `es`;
- `sourceCategory`: `campaign`, `organic_search`, `ai_referral`, `referral`, `direct` or `unknown`;
- `sourceName`: `google`, `bing`, `chatgpt`, `other` or `null`;
- first UTM source, medium, campaign, term and content values when supplied;
- capture timestamp, retained in session storage but not forwarded downstream.

Classification is intentionally small and deterministic. A UTM-tagged landing is `campaign`; supported Google hostnames are Google organic search; `bing.com` is Bing organic search; `chatgpt.com` is a ChatGPT AI referral; other valid external hosts are referrals. Unknown remains a valid classification.

## Contact envelope v2

The server validates the browser payload and forwards this additional sanitized object to n8n:

```json
{
  "form": "contact_v2",
  "first_touch": {
    "referrer_host": "chatgpt.com",
    "landing_path": "/process",
    "landing_locale": "en",
    "source_category": "ai_referral",
    "source_name": "chatgpt"
  },
  "utm": {
    "source": null,
    "medium": null,
    "campaign": null,
    "term": null,
    "content": null
  }
}
```

The remaining contact, request-correlation and idempotency fields retain their existing contract.

Before deployment, the n8n owner must confirm that the workflow accepts `contact_v2`, preserves the first-touch values without broadening collection, and continues to deduplicate on `idempotency_key`.

## Proposed HubSpot properties

Do not create these properties automatically. The CRM owner must approve their names, object scope and workflow mapping.

Minimum Contact properties:

| Proposed internal name          | Type             | Source                        |
| ------------------------------- | ---------------- | ----------------------------- |
| `brunova_first_source_category` | Enumeration      | `first_touch.source_category` |
| `brunova_first_source_name`     | Enumeration      | `first_touch.source_name`     |
| `brunova_first_referrer_host`   | Single-line text | `first_touch.referrer_host`   |
| `brunova_first_landing_path`    | Single-line text | `first_touch.landing_path`    |
| `brunova_first_landing_locale`  | Enumeration      | `first_touch.landing_locale`  |

Map UTM values to existing approved HubSpot original-source/UTM properties where those semantics match. Create new UTM properties only if the CRM owner confirms that HubSpot's existing fields cannot preserve the submitted first-touch values.

At Deal creation, copy the five Brunova first-touch values from the associated Contact to the Deal if HubSpot reporting cannot reliably traverse the association. Qualification, won/lost state and close outcome should continue to use HubSpot's governed lifecycle and deal fields rather than new website-defined fields.

## Human approval gate

Production deployment of `contact_v2` requires:

- n8n workflow acceptance and persistence confirmed;
- HubSpot property and mapping decision confirmed;
- EN/ES privacy wording reviewed by the responsible human/legal owner;
- one end-to-end test proving exactly one contact record and the expected first-touch values.
