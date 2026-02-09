import type { ProductStatus } from "../types";

const STATUS_STYLE: Record<ProductStatus, { label: string; className: string }> = {
  Active: {
    label: "Active",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  Shipped: {
    label: "Shipped",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  Archived: {
    label: "Archived",
    className: "border-neutral-300 bg-neutral-100 text-neutral-600",
  },
};

export const StatusBadge = ({
  status,
  size = "md",
}: {
  status: ProductStatus;
  size?: "sm" | "md";
}) => {
  const style = STATUS_STYLE[status];
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border font-medium ${style.className} ${sizeClass}`}
    >
      {style.label}
    </span>
  );
};
