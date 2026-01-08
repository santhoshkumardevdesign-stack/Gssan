"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-charcoal-100">
        <Container>
          <Breadcrumb items={[{ label: "Contact Us" }]} />
        </Container>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-cream">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-charcoal-600">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-heading font-semibold text-charcoal mb-4">
                Get in Touch
              </h2>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="bg-cream rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-maroon-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-maroon" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal">Phone</h3>
                    <a
                      href="tel:+918300051198"
                      className="text-charcoal-600 hover:text-maroon transition-colors"
                    >
                      +91 83000 51198
                    </a>
                  </div>
                </div>

                <div className="bg-cream rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal">WhatsApp</h3>
                    <a
                      href="https://wa.me/918300051198"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charcoal-600 hover:text-green-600 transition-colors"
                    >
                      +91 83000 51198
                    </a>
                    <p className="text-xs text-charcoal-500 mt-1">
                      Fastest response time!
                    </p>
                  </div>
                </div>

                <div className="bg-cream rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-saffron-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-saffron" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal">Email</h3>
                    <a
                      href="mailto:contact@gsaanproducts.com"
                      className="text-charcoal-600 hover:text-saffron transition-colors"
                    >
                      contact@gsaanproducts.com
                    </a>
                  </div>
                </div>

                <div className="bg-cream rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal">Location</h3>
                    <p className="text-charcoal-600">Salem, Tamil Nadu, India</p>
                  </div>
                </div>

                <div className="bg-cream rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal">Business Hours</h3>
                    <p className="text-charcoal-600">Mon - Sat: 9am - 8pm</p>
                    <p className="text-charcoal-600">Sunday: 10am - 6pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-cream rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-heading font-semibold text-charcoal mb-6">
                  Send us a Message
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-charcoal-600 mb-4">
                      Thank you for contacting us. We'll get back to you within
                      24 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          phone: "",
                          email: "",
                          subject: "",
                          message: "",
                        });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="Email (Optional)"
                      type="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                    <Input
                      label="Subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      required
                    />
                    <Textarea
                      label="Message"
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      rows={5}
                      required
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      rightIcon={<Send className="h-5 w-5" />}
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Map Section - Placeholder */}
      <section className="py-12 bg-cream">
        <Container>
          <div className="bg-charcoal-100 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-charcoal-400 mx-auto mb-2" />
              <p className="text-charcoal-500">
                Map integration can be added here
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
