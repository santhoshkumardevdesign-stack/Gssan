import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
}

const variantStyles = {
  default: "bg-charcoal-50 text-charcoal",
  primary: "bg-maroon-50 text-maroon",
  success: "bg-green-50 text-green-600",
  warning: "bg-saffron-50 text-saffron-600",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-charcoal">{value}</p>
          {subtitle && (
            <p className="text-sm text-charcoal-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p
              className={`text-sm mt-1 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last
              month
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${variantStyles[variant]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
