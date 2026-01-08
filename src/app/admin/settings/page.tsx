"use client";

import { useState } from "react";
import {
  Store,
  Phone,
  MapPin,
  Truck,
  Save,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "GSAAN Products",
    tagline: "Premium Puja Essentials",
    phone: "8300051198",
    alternatePhone: "",
    email: "contact@gsaanproducts.com",
    address: "Salem, Tamil Nadu, India",
    freeDeliveryThreshold: "499",
    deliveryCharge: "49",
    whatsappNumber: "918300051198",
    instagramUrl: "https://instagram.com/gsaanproducts",
    facebookUrl: "https://facebook.com/gsaanproducts",
  });

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-charcoal">
          Settings
        </h1>
        <p className="text-charcoal-500">Configure your store settings</p>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-maroon-50 rounded-lg flex items-center justify-center">
            <Store className="h-5 w-5 text-maroon" />
          </div>
          <div>
            <h2 className="font-heading font-semibold">Business Information</h2>
            <p className="text-sm text-charcoal-500">
              Your store name and basic details
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Store Name"
            value={settings.storeName}
            onChange={(e) => handleChange("storeName", e.target.value)}
          />
          <Input
            label="Tagline"
            value={settings.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={settings.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-saffron-50 rounded-lg flex items-center justify-center">
            <Phone className="h-5 w-5 text-saffron" />
          </div>
          <div>
            <h2 className="font-heading font-semibold">Contact Information</h2>
            <p className="text-sm text-charcoal-500">
              Phone numbers and address
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Primary Phone"
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <Input
              label="Alternate Phone"
              value={settings.alternatePhone}
              onChange={(e) => handleChange("alternatePhone", e.target.value)}
              placeholder="Optional"
            />
          </div>
          <Input
            label="WhatsApp Number (with country code)"
            value={settings.whatsappNumber}
            onChange={(e) => handleChange("whatsappNumber", e.target.value)}
            helper="e.g., 918300051198 (91 is India country code)"
          />
          <Textarea
            label="Business Address"
            value={settings.address}
            onChange={(e) => handleChange("address", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Truck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-heading font-semibold">Delivery Settings</h2>
            <p className="text-sm text-charcoal-500">
              Delivery charges and thresholds
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Free Delivery Threshold (₹)"
              type="number"
              value={settings.freeDeliveryThreshold}
              onChange={(e) =>
                handleChange("freeDeliveryThreshold", e.target.value)
              }
              helper="Orders above this amount get free delivery"
            />
            <Input
              label="Delivery Charge (₹)"
              type="number"
              value={settings.deliveryCharge}
              onChange={(e) => handleChange("deliveryCharge", e.target.value)}
              helper="Charge for orders below threshold"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-heading font-semibold">Social Links</h2>
            <p className="text-sm text-charcoal-500">Your social media links</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Instagram URL"
            value={settings.instagramUrl}
            onChange={(e) => handleChange("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/yourstore"
          />
          <Input
            label="Facebook URL"
            value={settings.facebookUrl}
            onChange={(e) => handleChange("facebookUrl", e.target.value)}
            placeholder="https://facebook.com/yourstore"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="h-5 w-5" />}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
