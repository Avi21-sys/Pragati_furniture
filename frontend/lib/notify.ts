// lib/notify.ts — fire-and-forget call to the standalone Notification Service.
// docs/API.md §2 (Enquiries) + §5. The enquiry is ALREADY saved in the DB before
// this runs; if the notification fails we only log it — never block the client.

type EnquiryNotificationPayload = {
  enquiryId: number;
  productName?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  message: string;
};

export async function notifyEnquiry(
  payload: EnquiryNotificationPayload
): Promise<void> {
  const baseUrl = process.env.NOTIFICATION_SERVICE_URL;
  const apiKey = process.env.INTERNAL_API_KEY;

  if (!baseUrl) {
    console.warn("[notify] NOTIFICATION_SERVICE_URL is not set — skipping notification");
    return;
  }

  try {
    await fetch(`${baseUrl.replace(/\/+$/, "")}/internal/notify/enquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": apiKey ?? "",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    // Fire-and-forget: a notification failure must never surface to the customer.
    console.error("[notify] notification service call failed", error);
  }
}