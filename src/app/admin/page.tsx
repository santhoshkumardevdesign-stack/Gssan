"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { StatsCard } from "@/components/admin";
import { formatPrice } from "@/lib/utils/formatters";
import { subscribeToOrders } from "@/services/orders.service";
import { Order } from "@/types";
import { Timestamp } from "firebase/firestore";

// Helper to convert Timestamp or Date to Date
const toDate = (value: Timestamp | Date): Date => {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  return value;
};

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

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysOrders = orders.filter(
    (order) => toDate(order.createdAt) >= today
  );
  const todaysRevenue = todaysOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const packedCount = orders.filter((o) => o.status === "packed").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0);

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-maroon" />
        <span className="ml-2 text-charcoal-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-charcoal">
          Dashboard
        </h1>
        <p className="text-charcoal-500">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Orders"
          value={todaysOrders.length.toString()}
          subtitle={`${pendingCount} pending`}
          icon={ShoppingBag}
          variant="primary"
        />
        <StatsCard
          title="Today's Revenue"
          value={formatPrice(todaysRevenue)}
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          title="Total Orders"
          value={orders.length.toString()}
          subtitle={`${deliveredCount} delivered`}
          icon={Package}
          variant="warning"
        />
        <StatsCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          subtitle="Delivered orders"
          icon={TrendingUp}
        />
      </div>

      {/* Recent Orders & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-lg">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-saffron hover:text-saffron-600"
            >
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-charcoal-500">
              No orders yet. Orders will appear here when customers place them.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-charcoal-100">
                    <th className="pb-3 text-sm font-medium text-charcoal-500">
                      Order
                    </th>
                    <th className="pb-3 text-sm font-medium text-charcoal-500">
                      Customer
                    </th>
                    <th className="pb-3 text-sm font-medium text-charcoal-500">
                      Total
                    </th>
                    <th className="pb-3 text-sm font-medium text-charcoal-500">
                      Status
                    </th>
                    <th className="pb-3 text-sm font-medium text-charcoal-500">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const StatusIcon =
                      statusIcons[order.status as keyof typeof statusIcons];
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-charcoal-50 last:border-0"
                      >
                        <td className="py-3">
                          <Link
                            href="/admin/orders"
                            className="text-sm font-medium text-maroon hover:text-maroon-700"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-charcoal">
                            {order.customer.name}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-medium">
                            {formatPrice(order.total)}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              statusColors[order.status as keyof typeof statusColors]
                            }`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-charcoal-500">
                            {getTimeAgo(toDate(order.createdAt))}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Status Summary */}
        <div className="bg-white rounded-xl shadow-card p-5">
          <h2 className="font-heading font-semibold text-lg mb-4">
            Order Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">Pending</span>
              </div>
              <span className="font-semibold">{pendingCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Confirmed</span>
              </div>
              <span className="font-semibold">{confirmedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                <span className="text-sm">Packed</span>
              </div>
              <span className="font-semibold">{packedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">Shipped</span>
              </div>
              <span className="font-semibold">{shippedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Delivered</span>
              </div>
              <span className="font-semibold">{deliveredCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
