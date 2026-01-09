"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Truck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import { subscribeToOrders, updateOrderStatus } from "@/services/orders.service";
import { Order } from "@/types";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  packed: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  packed: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: AlertCircle,
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

type OrderStatus = keyof typeof statusColors;

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Subscribe to real-time order updates
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.phone.includes(search);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus as Order["status"]);
      // Update local state for the selected order if open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus as Order["status"] } : null
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getAddressString = (order: Order) => {
    const addr = order.customer.address;
    return [
      addr.line1,
      addr.line2,
      addr.city,
      addr.state,
      addr.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-maroon" />
        <span className="ml-2 text-charcoal-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-charcoal">Orders</h1>
        <p className="text-charcoal-500">
          Manage and track customer orders ({orders.length} total)
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by order ID, customer name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-charcoal-400" />}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-maroon focus:border-maroon"
        >
          <option value="all">All Status</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-charcoal-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const StatusIcon = statusIcons[order.status as OrderStatus];
                return (
                  <tr
                    key={order.id}
                    className="border-b border-charcoal-100 hover:bg-charcoal-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-maroon">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-charcoal">
                          {order.customer.name}
                        </p>
                        <p className="text-sm text-charcoal-500">
                          {order.customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{order.items.length} items</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.status as OrderStatus]
                        }`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-charcoal-500">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-charcoal-500">
              {orders.length === 0
                ? "No orders yet. Orders will appear here when customers place them."
                : "No orders match your search."}
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status Update */}
            <div className="flex items-center justify-between p-4 bg-charcoal-50 rounded-lg">
              <span className="font-medium">Update Status:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(selectedOrder.id, e.target.value)
                }
                disabled={updating}
                className="px-3 py-1.5 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-maroon disabled:opacity-50"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="font-medium text-charcoal mb-2">Customer Details</h4>
              <div className="p-4 bg-cream rounded-lg space-y-2">
                <p className="font-medium">{selectedOrder.customer.name}</p>
                <p className="flex items-center gap-2 text-sm text-charcoal-600">
                  <Phone className="h-4 w-4" />
                  {selectedOrder.customer.phone}
                </p>
                <p className="flex items-start gap-2 text-sm text-charcoal-600">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  {getAddressString(selectedOrder)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-charcoal mb-2">Order Items</h4>
              <div className="border border-charcoal-100 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-charcoal-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">Product</th>
                      <th className="px-4 py-2 text-center text-sm">Qty</th>
                      <th className="px-4 py-2 text-right text-sm">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-t border-charcoal-100">
                        <td className="px-4 py-2">
                          <p className="font-medium text-sm">
                            {item.productName}
                          </p>
                          <p className="text-xs text-charcoal-500">
                            {item.variantName}
                          </p>
                        </td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">
                          {formatPrice(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {selectedOrder.deliveryCharge === 0
                      ? "FREE"
                      : formatPrice(selectedOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-maroon">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <Button
              variant="primary"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                window.open(
                  `https://wa.me/91${selectedOrder.customer.phone}`,
                  "_blank"
                );
              }}
              leftIcon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              }
            >
              Contact on WhatsApp
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
