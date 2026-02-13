import { useMemo } from "react";
import { HOME_AREAS } from "../shared/constants";
import { PRODUCTS, REVIEWS } from "../shared/data";
import { sortByDateDesc } from "../shared/format";
import { trackHubClick } from "../shared/tracking";
import { AreaIcon, ArrowIcon, CubeIcon } from "../components/icons";
import { Link } from "../components/link";
import { ProductCard } from "../components/product-card";
import { ReviewCard } from "../components/review-card";
import { SectionTitle } from "../components/section-title";

export const HomePage = () => {
  const latestReviews = useMemo(
    () => sortByDateDesc(REVIEWS, (item) => item.publishDate).slice(0, 3),
    [],
  );

  return (
    <section className="pb-14">
      <div className="border-b border-[#e5e5e5] pb-20 pt-20 lg:pr-80">
        <span className="inline-flex h-[34px] items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium tracking-[-0.1504px] text-emerald-700">
          <span className="mr-2 size-2 rounded-full bg-[#00bc7d] opacity-90" />
          正在做有趣的产品
        </span>

        <h1 className="mt-6 text-5xl font-medium leading-[1.08] tracking-[-1.677px] text-[#171717] md:text-[72px]">
          设计 + 开发
        </h1>
        <p className="text-5xl font-medium leading-[1.08] tracking-[-1.677px] text-[#525252] md:text-[72px]">
          用代码实现想法
        </p>
        <p className="mt-6 max-w-[671px] text-base leading-8 tracking-[-0.4492px] text-[#525252] md:text-[20px]">
          从想法到产品，记录每一次迭代。这里是我的产品实验室，展示正在做的项目、探索的想法，以及每次发版的思考。
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/products"
            onClick={() => trackHubClick("main_view_products")}
            className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-[#009966] px-7 text-base font-medium tracking-[-0.3125px] text-white shadow-sm"
          >
            <CubeIcon />
            查看产品
          </Link>
          <Link
            to="/reviews"
            onClick={() => trackHubClick("main_view_reviews")}
            className="inline-flex h-[52px] items-center gap-2 rounded-xl px-7 text-base font-medium tracking-[-0.3125px] text-[#404040]"
          >
            阅读复盘
            <ArrowIcon />
          </Link>
        </div>
      </div>

      <div className="border-b border-[#e5e5e5] pb-20 pt-20">
        <SectionTitle
          title="三个专区"
          subtitle="不同阶段的内容，统一的品质追求"
        />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {HOME_AREAS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`group rounded-2xl border p-6 transition-all duration-200 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.08),0px_2px_6px_rgba(0,0,0,0.04)] ${item.cardClassName} ${item.hoverBorderClassName}`}
            >
              <div className="mb-4 flex items-start justify-between">
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-xl transition-colors duration-200 ${item.iconClassName} ${item.hoverIconClassName}`}
                >
                  <AreaIcon icon={item.icon} />
                </span>
                <span
                  className={`text-neutral-400 transition-all duration-200 group-hover:translate-x-0.5 ${item.hoverArrowClassName}`}
                >
                  <ArrowIcon className="size-4" />
                </span>
              </div>
              <h3 className="text-[18px] font-semibold leading-7 tracking-[-0.4395px] text-[#171717]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[#737373]">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-b border-[#e5e5e5] pb-20 pt-20">
        <SectionTitle
          title="正在做的产品"
          subtitle="持续迭代中"
          action={{ label: "查看全部", to: "/products" }}
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="pt-20">
        <SectionTitle
          title="最新复盘"
          subtitle="记录每次迭代的思考"
          action={{ label: "查看全部", to: "/reviews" }}
        />
        <div className="mt-6 space-y-4">
          {latestReviews.map((item) => (
            <ReviewCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
