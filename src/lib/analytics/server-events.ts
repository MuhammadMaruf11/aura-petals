import "server-only";

type ServerEventName = "Purchase" | "InitiateCheckout";

type ServerEventPayload = {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_type?: string;
};

/**
 * Server-side counterpart to the client pixel/GTM events (features/analytics).
 * This is intentionally a thin, safe-to-no-op wrapper: if META_PIXEL_ID /
 * a conversions API access token aren't configured, it just logs in dev and
 * returns — it never throws, since analytics must never break checkout.
 */
export async function trackServerEvent(
  event: ServerEventName,
  payload: ServerEventPayload,
) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !accessToken) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[analytics:server] ${event}`, payload);
    }
    return;
  }

  try {
    await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: event,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            custom_data: payload,
          },
        ],
        access_token: accessToken,
      }),
    });
  } catch {
    // Analytics failures must never break the checkout flow.
  }
}
