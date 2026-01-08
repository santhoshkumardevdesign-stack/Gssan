import { Order, CartItem, CheckoutFormData } from "@/types";
import { formatPrice, formatDate } from "./formatters";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918300051198";

/**
 * Build WhatsApp order message
 */
export function buildOrderMessage(order: Order): string {
  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.productName} (${item.variantName}) x${item.quantity} = ${formatPrice(item.totalPrice)}`
    )
    .join("\n");

  const address = order.customer.address;
  const addressLines = [
    order.customer.name,
    address.line1,
    address.line2,
    `${address.city}, ${address.state} - ${address.pincode}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `
🙏 *புதிய ஆர்டர் - GSAAN Products*

*Order #:* ${order.orderNumber}
*Date:* ${formatDate(order.createdAt)}

━━━━━━━━━━━━━━━━━━
*பொருட்கள் (Products):*
${itemsList}
━━━━━━━━━━━━━━━━━━

*Subtotal:* ${formatPrice(order.subtotal)}
*Delivery:* ${order.deliveryCharge > 0 ? formatPrice(order.deliveryCharge) : "FREE"}
*Total:* ${formatPrice(order.total)}

━━━━━━━━━━━━━━━━━━
*டெலிவரி முகவரி (Delivery Address):*
${addressLines}

*Phone:* ${order.customer.phone}
${order.customer.whatsapp && order.customer.whatsapp !== order.customer.phone ? `*WhatsApp:* ${order.customer.whatsapp}` : ""}
${order.customerNotes ? `\n*குறிப்பு (Notes):* ${order.customerNotes}` : ""}
━━━━━━━━━━━━━━━━━━

தயவுசெய்து இந்த ஆர்டரை உறுதிப்படுத்தவும் 🙏
Please confirm this order.
`.trim();
}

/**
 * Build WhatsApp message from cart and checkout form
 */
export function buildCartOrderMessage(
  items: CartItem[],
  formData: CheckoutFormData,
  subtotal: number,
  deliveryCharge: number,
  total: number
): string {
  const itemsList = items
    .map(
      (item) =>
        `• ${item.productName} (${item.variantName}) x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  const addressLines = [
    formData.name,
    formData.address,
    formData.landmark,
    `${formData.city}, ${formData.state} - ${formData.pincode}`,
  ]
    .filter(Boolean)
    .join("\n");

  const date = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
🙏 *புதிய ஆர்டர் - GSAAN Products*

*Date:* ${date}

━━━━━━━━━━━━━━━━━━
*பொருட்கள் (Products):*
${itemsList}
━━━━━━━━━━━━━━━━━━

*Subtotal:* ${formatPrice(subtotal)}
*Delivery:* ${deliveryCharge > 0 ? formatPrice(deliveryCharge) : "FREE"}
*Total:* ${formatPrice(total)}

━━━━━━━━━━━━━━━━━━
*டெலிவரி முகவரி (Delivery Address):*
${addressLines}

*Phone:* ${formData.phone}
${formData.whatsapp && formData.whatsapp !== formData.phone ? `*WhatsApp:* ${formData.whatsapp}` : ""}
${formData.email ? `*Email:* ${formData.email}` : ""}
${formData.notes ? `\n*குறிப்பு (Notes):* ${formData.notes}` : ""}
━━━━━━━━━━━━━━━━━━

தயவுசெய்து இந்த ஆர்டரை உறுதிப்படுத்தவும் 🙏
Please confirm this order.
`.trim();
}

/**
 * Build WhatsApp message for single product inquiry
 */
export function buildProductInquiryMessage(
  productName: string,
  variantName?: string
): string {
  return `
Hi, I'm interested in ordering:

*${productName}*${variantName ? ` (${variantName})` : ""}

Please share the details and availability.
`.trim();
}

/**
 * Build WhatsApp URL with pre-filled message
 */
export function getWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with message
 */
export function openWhatsApp(message: string): void {
  const url = getWhatsAppUrl(message);
  window.open(url, "_blank");
}

/**
 * Open WhatsApp for order
 */
export function openWhatsAppOrder(order: Order): void {
  const message = buildOrderMessage(order);
  openWhatsApp(message);
}

/**
 * Open WhatsApp for cart checkout
 */
export function openWhatsAppCheckout(
  items: CartItem[],
  formData: CheckoutFormData,
  subtotal: number,
  deliveryCharge: number,
  total: number
): void {
  const message = buildCartOrderMessage(
    items,
    formData,
    subtotal,
    deliveryCharge,
    total
  );
  openWhatsApp(message);
}

/**
 * Open WhatsApp for product inquiry
 */
export function openWhatsAppInquiry(
  productName: string,
  variantName?: string
): void {
  const message = buildProductInquiryMessage(productName, variantName);
  openWhatsApp(message);
}

/**
 * Get plain WhatsApp chat URL (no pre-filled message)
 */
export function getWhatsAppChatUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
}
