import { formatDateFull, formatDateMonthDay, resolveImageUrl } from "../shared/format";
import type { Product, ProductStatus } from "../types";
import { ArrowIcon, CalendarIcon } from "./icons";
import { Link } from "./link";

const statusClassName: Record<ProductStatus, string> = {
  active: "bg-emerald-50 border-emerald-200 text-emerald-700",
  archived: "bg-neutral-100 border-neutral-300 text-neutral-600",
};

export const ProductStatusBadge = ({ status }: { status: ProductStatus }) => (
  <span
    className={`inline-flex h-[22px] items-center rounded-full border px-2 text-xs font-medium ${statusClassName[status]}`}
  >
    {status === "active" ? "Active" : "Archived"}
  </span>
);

export const ProductCard = ({ product }: { product: Product }) => (
  <article className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
    <div className="relative h-[334px] bg-neutral-100">
      <img
        src={resolveImageUrl(product.coverImage)}
        alt={product.name}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute left-3 top-3">
        <ProductStatusBadge status={product.status} />
      </div>
    </div>

    <div className="space-y-3 px-5 py-5">
      <div className="flex items-center justify-between text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <span className="rounded bg-[#f5f5f5] px-2 py-0.5 text-[#525252]">
            {product.currentVersion}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <CalendarIcon />
            {formatDateMonthDay(product.currentVersionCommitDate)}
          </span>
        </div>
      </div>

      <h3 className="text-[18px] font-semibold leading-[24.75px] tracking-[-0.02em] text-[#171717]">
        {product.name}
      </h3>
      <p className="text-sm leading-6 text-[#525252]">{product.summary}</p>
      <Link
        to={product.link}
        className="inline-flex items-center gap-1 text-sm font-medium text-[#009966]"
      >
        查看详情
        <ArrowIcon />
      </Link>
    </div>
  </article>
);

export const ProductDetailMeta = ({ product }: { product: Product }) => (
  <div className="grid gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 sm:grid-cols-2">
    <div>
      <p className="text-xs text-neutral-500">当前版本</p>
      <p className="mt-1 font-medium text-neutral-900">{product.currentVersion}</p>
    </div>
    <div>
      <p className="text-xs text-neutral-500">版本提交日期</p>
      <p className="mt-1 font-medium text-neutral-900">
        {formatDateFull(product.currentVersionCommitDate)}
      </p>
    </div>
  </div>
);
