import { useMemo } from "react";
import { ReviewCard } from "../components/review-card";
import { REVIEWS } from "../shared/data";
import { sortByDateDesc } from "../shared/format";

export const ReviewsPage = () => {
  const reviews = useMemo(
    () => sortByDateDesc(REVIEWS, (item) => item.publishDate),
    [],
  );

  return (
    <section className="mx-auto max-w-[1024px] pb-14 pt-16">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-[36px] font-medium leading-[40px] tracking-[-0.5309px] text-[#171717]">
            复盘
          </h1>
          <p className="text-base leading-[26px] tracking-[-0.3125px] text-[#525252]">
            每次发版的复盘与反思 · 记录产品迭代的思考过程
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {reviews.map((item) => (
            <ReviewCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
