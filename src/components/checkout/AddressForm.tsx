"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Address } from "@/types";
import { validatePhone, validatePincode, validateRequired } from "@/lib/utils/validators";

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  onCancel?: () => void;
  initialValues?: Partial<Address>;
}

const TAMIL_NADU_DISTRICTS = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivagangai",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupattur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];

export function AddressForm({ onSubmit, initialValues }: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<Address>>({
    fullName: initialValues?.fullName || "",
    phone: initialValues?.phone || "",
    addressLine1: initialValues?.addressLine1 || "",
    addressLine2: initialValues?.addressLine2 || "",
    city: initialValues?.city || "",
    district: initialValues?.district || "Salem",
    state: initialValues?.state || "Tamil Nadu",
    pincode: initialValues?.pincode || "",
    landmark: initialValues?.landmark || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData as Address);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        label="Mobile Number"
        type="tel"
        placeholder="10-digit mobile number"
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        error={errors.phone}
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
          options={TAMIL_NADU_DISTRICTS.map((d) => ({ value: d, label: d }))}
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
  );
}
