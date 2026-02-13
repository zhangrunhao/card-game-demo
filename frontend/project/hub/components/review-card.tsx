import { formatDateMonthDay } from "../shared/format";
import type { Review } from "../types";
import { CalendarIcon, ProductMarkIcon } from "./icons";

export const ReviewCard = ({ item }: { item: Review }) => {
  const summaryOne = item.dataChanges[0] ?? "-";
  const summaryTwo = item.dataChanges[1] ?? "-";

  return (
    <article className="group rounded-r-2xl border border-[#e5e5e5] border-l-4 border-l-[#2b7fff] bg-white px-5 pb-4 pt-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] transition-all duration-200 hover:bg-blue-50/30 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.08),0px_2px_6px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#737373]">
        <span className="inline-flex items-center gap-1 rounded bg-[#f5f5f5] px-2 py-1 text-[#404040]">
          <ProductMarkIcon />
          {item.productName}
        </span>
        <span className="rounded border border-[#bedbff] bg-[#dbeafe] px-2 py-0.5 text-[#1447e6]">
          {item.version}
        </span>
        <span className="text-[#a1a1a1]">·</span>
        <span className="inline-flex items-center gap-1 text-[#737373]">
          <CalendarIcon />
          {formatDateMonthDay(item.publishDate)}
        </span>
      </div>

      <h3 className="mt-3 text-[18px] font-semibold leading-[24.75px] tracking-[-0.4395px] text-[#171717] transition-colors duration-200 group-hover:text-blue-600">
        {item.headline}
      </h3>

      <div className="mt-3 grid gap-3 text-xs leading-[19.5px] text-[#404040] md:grid-cols-3">
        <div className="rounded-lg px-2 py-1 transition-colors duration-200 group-hover:bg-white/70">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3px] text-[#009966]">
            做了什么
          </p>
          <p>{summaryOne}</p>
        </div>
        <div className="rounded-lg px-2 py-1 transition-colors duration-200 group-hover:bg-white/70">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3px] text-[#155dfc]">
            影响
          </p>
          <p>{summaryTwo}</p>
        </div>
        <div className="rounded-lg px-2 py-1 transition-colors duration-200 group-hover:bg-white/70">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3px] text-[#e17100]">
            下一步
          </p>
          <p>{item.nextPlan}</p>
        </div>
      </div>
    </article>
  );
};
