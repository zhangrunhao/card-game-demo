import { useMemo } from "react";
import { ProductCard } from "../components/product-card";
import { PRODUCTS } from "../shared/data";
import { sortByDateDesc } from "../shared/format";

export const ProductsPage = () => {
  const products = useMemo(
    () => sortByDateDesc(PRODUCTS, (item) => item.currentVersionCommitDate),
    [],
  );

  return (
    <section className="space-y-6 pb-14 pt-8">
      <div>
        <h1 className="text-[36px] font-semibold leading-[40px] tracking-[-0.03em] text-[#171717]">
          产品
        </h1>
        <p className="mt-3 text-base text-[#525252]">已上线且持续迭代的项目</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
