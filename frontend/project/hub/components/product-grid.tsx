import type { Product } from "../types";
import { Link } from "./link";
import { StatusBadge } from "./status-badge";

export const ProductGrid = ({ products }: { products: Product[] }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {products.map((product) => (
      <Link
        key={product.id}
        to={`/products/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-600 hover:shadow-md"
        ariaLabel={product.title}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
          <img
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            src={product.cover}
            alt={product.title}
            loading="lazy"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={product.status} size="sm" />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
            <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-neutral-600">
              {product.version}
            </span>
            <span>·</span>
            <time dateTime={product.lastUpdated}>
              {new Date(product.lastUpdated).toLocaleDateString("zh-CN", {
                month: "numeric",
                day: "numeric",
              })}
            </time>
            <span className="ml-auto">{product.category}</span>
          </div>

          <h3 className="text-base font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-emerald-600 sm:text-lg">
            {product.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {product.summary}
          </p>

          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 transition-all group-hover:gap-1.5">
            查看详情
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M5.25 2.9165L9.3335 6.99984L5.25 11.0832"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    ))}
  </div>
);
