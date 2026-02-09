import type { Product } from "../types";
import { useMemo, useState } from "react";
import { FilterBar } from "./filter-bar";
import { ProductGrid } from "./product-grid";

const STATUS_OPTIONS = [
  { label: "全部", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Shipped", value: "Shipped" },
  { label: "Archived", value: "Archived" },
];

const CATEGORY_OPTIONS = [
  { label: "全部", value: "all" },
  { label: "工具", value: "工具" },
  { label: "记录", value: "记录" },
  { label: "游戏", value: "游戏" },
  { label: "创作", value: "创作" },
];

export const ProductListPage = ({ products }: { products: Product[] }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const sortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesStatus =
          statusFilter === "all" || product.status === statusFilter;
        const matchesCategory =
          categoryFilter === "all" || product.category === categoryFilter;
        return matchesStatus && matchesCategory;
      })
      .sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
  }, [categoryFilter, products, statusFilter]);

  return (
    <section>
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
          产品
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
          已上线且持续迭代的项目集合
        </p>
      </header>

      <div className="mb-6 space-y-3 sm:mb-8">
        <FilterBar
          label="状态"
          options={STATUS_OPTIONS}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
        <FilterBar
          label="分类"
          options={CATEGORY_OPTIONS}
          activeFilter={categoryFilter}
          onFilterChange={setCategoryFilter}
        />
      </div>

      {sortedProducts.length > 0 ? (
        <ProductGrid products={sortedProducts} />
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-12 text-center">
          <p className="text-neutral-600">没有匹配的产品，试试切换筛选条件。</p>
        </div>
      )}
    </section>
  );
};
