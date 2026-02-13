import { useMemo } from "react";
import { CalendarIcon } from "../components/icons";
import { IDEAS } from "../shared/data";
import { formatDateYmd, sortByDateDesc } from "../shared/format";

export const IdeasPage = () => {
  const ideas = useMemo(() => sortByDateDesc(IDEAS, (item) => item.ideaDate), []);

  return (
    <section className="pb-14 pt-16">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-[36px] font-medium leading-[40px] tracking-[-0.5309px] text-[#171717]">
            想法
          </h1>
          <p className="text-base leading-[26px] tracking-[-0.3125px] text-[#525252]">
            想法、实验和原型 · 还在探索中的创意
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {ideas.map((idea) => (
            <article
              key={idea.id}
              className="h-[95.5px] rounded-2xl border-2 border-[#d4d4d4] bg-[linear-gradient(175deg,rgba(255,251,235,0.4)_0%,#ffffff_100%)] px-[22px] pb-[2px] pt-[22px]"
            >
              <div className="flex h-[51.5px] items-center justify-between">
                <div className="min-w-0">
                  <h2 className="text-[18px] font-semibold leading-[24.75px] tracking-[-0.4395px] text-[#171717]">
                    {idea.name}
                  </h2>
                  <p className="mt-1 text-sm leading-[22.75px] tracking-[-0.1504px] text-[#525252]">
                    {idea.summary}
                  </p>
                </div>
                <div className="ml-4 inline-flex items-center gap-1.5 text-xs text-[#737373]">
                  <CalendarIcon />
                  {formatDateYmd(idea.ideaDate)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
