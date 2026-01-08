"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Check,
  ShoppingBag,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { OrderSummary } from "@/components/checkout";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/formatters";
import { validatePhone, validatePincode, validateRequired } from "@/lib/utils/validators";
import { buildOrderMessage, getWhatsAppUrl } from "@/lib/utils/whatsapp";
import { createOrder } from "@/services/orders.service";
import { Address, Order } from "@/types";

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE = 49;

const TAMIL_NADU_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam",
  "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
  "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni",
  "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur",
  "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar",
];

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GSAAN-${dateStr}-${random}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Address & { phone: string }>>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "Salem",
    state: "Tamil Nadu",
    pincode: "",
    landmark: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to cart if empty
  useEffect(() => {
    if (isClient && items.length === 0) {
      router.push("/cart");
    }
  }, [isClient, items.length, router]);

  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.fullName || "")) {
      newErrors.fullName = "Full name is required";
    }

    if (!validatePhone(formData.phone || "")) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!validateRequired(formData.addressLine1 || "")) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!validateRequired(formData.city || "")) {
      newErrors.city = "City is required";
    }

    if (!validatePincode(formData.pincode || "")) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppCheckout = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Create order object
      const order: Omit<Order, "id"> = {
        orderNumber: generateOrderNumber(),
        customer: {
          name: formData.fullName || "",
          phone: formData.phone || "",
          email: "",
          address: {
            fullName: formData.fullName || "",
            phone: formData.phone || "",
            addressLine1: formData.addressLine1 || "",
            addressLine2: formData.addressLine2 || "",
            city: formData.city || "",
            district: formData.district || "",
            state: formData.state || "",
            pincode: formData.pincode || "",
            landmark: formData.landmark || "",
          },
        },
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        subtotal,
        deliveryCharge,
        discount: 0,
        total,
        status: "pending",
        paymentMethod: "cod",
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save order to Firestore
      await createOrder(order);

      // Build WhatsApp message
      const message = buildOrderMessage({ ...order, id: "" });
      const whatsappUrl = getWhatsAppUrl(message);

      // Clear cart and redirect
      clearCart();
      window.open(whatsappUrl, "_blank");
      router.push("/checkout/success?orderNumber=" + order.orderNumber);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-charcoal-100">
        <Container>
          <Breadcrumb
            items={[
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
          />
        </Container>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-charcoal-100">
        <Container>
          <div className="py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-charcoal">
              Checkout
            </h1>
            <p className="text-charcoal-500 mt-1">
              Complete your order via WhatsApp
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-card p-4 md:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-maroon-50 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-maroon" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-lg">
                    Delivery Address
                  </h2>
                  <p className="text-sm text-charcoal-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <form className="space-y-4">
                {/* Full Name */}
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  error={errors.fullName}
                  required
                />

                {/* Phone */}
                <Input
                  label="Mobile Number (WhatsApp)"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  error={errors.phone}
                  helper="We'll send order updates on WhatsApp"
                  required
                />

                {/* Address Line 1 */}
                <Textarea
                  label="Address"
                  placeholder="House/Flat No., Building Name, Street"
                  value={formData.addressLine1}
                  onChange={(e) => handleChange("addressLine1", e.target.value)}
                  error={errors.addressLine1}
                  rows={2}
                  required
                />

                {/* Address Line 2 */}
                <Input
                  label="Area/Locality"
                  placeholder="Area, Colony, Locality"
                  value={formData.addressLine2}
                  onChange={(e) => handleChange("addressLine2", e.target.value)}
                />

                {/* City & District */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City/Town"
                    placeholder="Enter city/town"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    error={errors.city}
                    required
                  />

                  <Select
                    label="District"
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    options={TAMIL_NADU_DISTRICTS.map((d) => ({
                      value: d,
                      label: d,
                    }))}
                  />
                </div>

                {/* State & Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="State"
                    value={formData.state}
                    disabled
                    className="bg-charcoal-50"
                  />

                  <Input
                    label="Pincode"
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    error={errors.pincode}
                    maxLength={6}
                    required
                  />
                </div>

                {/* Landmark */}
                <Input
                  label="Landmark (Optional)"
                  placeholder="Near temple, school, etc."
                  value={formData.landmark}
                  onChange={(e) => handleChange("landmark", e.target.value)}
                />
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-card p-4 md:p-6 mt-6">
              <h2 className="font-heading font-semibold text-lg mb-4">
                Payment Method
              </h2>

              <div className="border-2 border-maroon bg-maroon-50 rounded-lg p-4 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-maroon flex items-center justify-center">
                  <Check className="h-3 w-3 text-maroon" />
                </div>
                <div>
                  <p className="font-medium text-charcoal">Cash on Delivery</p>
                  <p className="text-sm text-charcoal-500">
                    Pay when you receive your order
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Cart - Mobile */}
            <Link
              href="/cart"
              className="flex items-center gap-2 mt-6 text-sm text-saffron hover:text-saffron-600 transition-colors lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-80 xl:w-96">
            <div className="sticky top-24 space-y-4">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                deliveryCharge={deliveryCharge}
                total={total}
              />

              {/* WhatsApp Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleWhatsAppCheckout}
                isLoading={isSubmitting}
                leftIcon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                }
              >
                Order via WhatsApp
              </Button>

              <p className="text-xs text-center text-charcoal-500">
                Clicking this will open WhatsApp with your order details
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
