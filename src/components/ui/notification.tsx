import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { toast } from "sonner";

type NotificationVariant = "success" | "error" | "info" | "warning";

interface NotificationProps {
  title: string;
  description?: string;
  variant?: NotificationVariant;
}

const getIconAndColor = (variant: NotificationVariant) => {
  switch (variant) {
    case "success":
      return {
        icon: CheckCircle2,
        className: "text-emerald-500",
        bgClass: "bg-emerald-50",
      };
    case "error":
      return {
        icon: XCircle,
        className: "text-red-500",
        bgClass: "bg-red-50",
      };
    case "warning":
      return {
        icon: AlertCircle,
        className: "text-amber-500",
        bgClass: "bg-amber-50",
      };
    case "info":
    default:
      return {
        icon: Info,
        className: "text-blue-500",
        bgClass: "bg-blue-50",
      };
  }
};

export const showNotification = ({ title, description, variant = "info" }: NotificationProps) => {
  const { icon: Icon, className, bgClass } = getIconAndColor(variant);

  toast(title, {
    description,
    icon: <Icon className={`h-5 w-5 ${className}`} />,
    className: `${bgClass} border-l-4 ${className.replace('text-', 'border-l-')}`,
    duration: 5000,
  });
};

// Convenience methods
export const showSuccess = (title: string, description?: string) => 
  showNotification({ title, description, variant: "success" });

export const showError = (title: string, description?: string) => 
  showNotification({ title, description, variant: "error" });

export const showInfo = (title: string, description?: string) => 
  showNotification({ title, description, variant: "info" });

export const showWarning = (title: string, description?: string) => 
  showNotification({ title, description, variant: "warning" });