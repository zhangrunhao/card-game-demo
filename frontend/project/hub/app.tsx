import { useEffect, useMemo, useState } from "react";
import { Link } from "./components/link";
import { PRODUCTS } from "./data/products";
import { normalizePath } from "./routing";
import type { Product, ProductStatus } from "./types";

type Route =
  | { name: "home" }
  | { name: "products" }
  | { name: "ideas" }
  | { name: "reviews" }
  | { name: "about" }
  | { name: "not-found" };

type NavItem = {
  label: string;
  to: string;
  routeName: Exclude<Route["name"], "not-found">;
  icon: "product" | "idea" | "review" | "about";
};

type IdeaTag = "Idea" | "Prototype" | "Lab";

type IdeaCard = {
  id: string;
  type: IdeaTag;
  title: string;
  date: string;
  summary: string;
  nextStep: string;
  tags: string[];
};

type Review = {
  id: string;
  product: string;
  version: string;
  date: string;
  title: string;
  done: string;
  impact: string;
  next: string;
};

const EMAIL_LINK = "mailto:runhaozhang.dev@gmail.com";
const GITHUB_LINK = "https://github.com/zhangrunhao";
const TWITTER_LINK = "https://x.com";

const NAV_ITEMS: NavItem[] = [
  { label: "产品", to: "/products", routeName: "products", icon: "product" },
  { label: "想法", to: "/ideas", routeName: "ideas", icon: "idea" },
  { label: "复盘", to: "/reviews", routeName: "reviews", icon: "review" },
  { label: "关于", to: "/about", routeName: "about", icon: "about" },
];

const HOME_AREAS = [
  {
    to: "/products",
    title: "产品",
    description: "已上线且持续迭代",
    icon: "product",
    iconClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    to: "/ideas",
    title: "想法",
    description: "想法、实验和原型",
    icon: "idea",
    iconClassName: "bg-amber-100 text-amber-700",
  },
  {
    to: "/reviews",
    title: "复盘",
    description: "每次发版的复盘",
    icon: "review",
    iconClassName: "bg-blue-100 text-blue-700",
  },
] as const;

const IDEAS: IdeaCard[] = [
  {
    id: "focus-soundtrack",
    type: "Lab",
    title: "Focus Soundtrack",
    date: "2/7",
    summary: "根据你的工作状态自动切换背景音乐的专注工具",
    nextStep: "测试不同音乐类型对专注力的影响，收集用户反馈",
    tags: ["音乐", "专注", "实验"],
  },
  {
    id: "micro-habits",
    type: "Prototype",
    title: "Micro Habits",
    date: "2/3",
    summary: "一个极简的微习惯追踪工具，每天只记录 3 个最重要的小习惯",
    nextStep: "完成数据可视化模块，设计习惯连续记录的激励机制",
    tags: ["健康", "习惯", "Web"],
  },
  {
    id: "quick-feedback",
    type: "Prototype",
    title: "Quick Feedback",
    date: "2/1",
    summary: "一个可以嵌入任何网站的快速反馈组件，3 秒完成反馈",
    nextStep: "开发嵌入 SDK，支持自定义样式",
    tags: ["用户体验", "工具", "SDK"],
  },
  {
    id: "one-page-wiki",
    type: "Idea",
    title: "One Page Wiki",
    date: "1/30",
    summary: "一个项目，一个页面。把所有信息塞进一页，强制精简",
    nextStep: "围绕互链，思考如何在一页内做好信息层级",
    tags: ["知识管理", "极简", "生产力"],
  },
];

const REVIEWS: Review[] = [
  {
    id: "card-game-v0-8-0",
    product: "卡牌游戏",
    version: "v0.8.0",
    date: "2/5",
    title: "卡牌游戏 v0.8.0 - 战斗节奏优化",
    done: "重做了出牌顺序提示和回合推进逻辑，支持连招提示",
    impact: "首局完成率提升 36%，单局时长缩短约 18%",
    next: "开始设计新手引导拆分方案，补齐首日留存数据",
  },
  {
    id: "calorie-app-v0-4-1",
    product: "热量摄入 app",
    version: "v0.4.1",
    date: "1/28",
    title: "热量摄入 app v0.4.1 - 餐次记录升级",
    done: "新增语音录入和常吃食物快捷补全，支持模糊匹配",
    impact: "记录耗时从 22 秒降到 11 秒，7 日使用率提升明显",
    next: "优化目标达成提醒体验，增加体脂率趋势卡片",
  },
  {
    id: "card-game-v0-7-2",
    product: "卡牌游戏",
    version: "v0.7.2",
    date: "1/15",
    title: "卡牌游戏 v0.7.2 - 卡组编辑体验",
    done: "支持拖拽排序和一键清空，补齐卡牌稀有度筛选",
    impact: "构建卡组的平均耗时下降 42%，重复编辑率下降",
    next: "继续迭代匹配策略，降低低段位对战等待时间",
  },
  {
    id: "calorie-app-v0-3-0",
    product: "热量摄入 app",
    version: "v0.3.0",
    date: "12/15",
    title: "热量摄入 app v0.3.0 - 周报功能上线",
    done: "新增每周摄入趋势图和营养结构分布，支持分享图片",
    impact: "用户周活提升 24%，连续打卡天数显著增加",
    next: "补充数据对比维度，加入节假日饮食标签",
  },
];

const resolveRoute = (pathname: string): Route => {
  const path = normalizePath(pathname);
  if (path === "/") {
    return { name: "home" };
  }
  if (path === "/products") {
    return { name: "products" };
  }
  if (path === "/ideas") {
    return { name: "ideas" };
  }
  if (path === "/reviews") {
    return { name: "reviews" };
  }
  if (path === "/about") {
    return { name: "about" };
  }
  return { name: "not-found" };
};

const usePathname = () => {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  return pathname;
};

const CalendarIcon = () => (
  <svg className="size-3" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M7 2V5M17 2V5M4 9H20M6 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6C4 4.89543 4.89543 4 6 4Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    className={className ?? "size-3.5"}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden
  >
    <path
      d="M3.5 8H12.5M12.5 8L9 4.5M12.5 8L9 11.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 6.5H20V17.5H4V6.5ZM4 7L12 13L20 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M9 18C5.5 19 5.5 16.5 4 16M14 20V17.5C14 16.4 14.1 16.1 13.5 15.5C16 15.2 18.5 14.2 18.5 10.5C18.5 9.5 18.1 8.6 17.5 7.8C17.7 7.2 17.8 6.2 17.3 5C17.3 5 16.5 4.7 14.5 6.1C13 5.7 11.5 5.7 10 6.1C8 4.7 7.2 5 7.2 5C6.7 6.2 6.8 7.2 7 7.8C6.4 8.6 6 9.5 6 10.5C6 14.2 8.5 15.2 11 15.5C10.4 16.1 10.4 16.7 10.5 17.5V20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ExternalIcon = () => (
  <svg className="size-3" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M10 3H13V6M13 3L8 8M6 4H4.5C3.67157 4 3 4.67157 3 5.5V11.5C3 12.3284 3.67157 13 4.5 13H10.5C11.3284 13 12 12.3284 12 11.5V10"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NavIcon = ({
  icon,
  active,
}: {
  icon: NavItem["icon"];
  active: boolean;
}) => {
  const className = `size-4 ${active ? "text-[#009966]" : "text-neutral-500"}`;

  if (icon === "product") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3L20 7.5L12 12L4 7.5L12 3ZM4 7.5V16.5L12 21V12M20 7.5V16.5L12 21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "idea") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 18H15M10 21H14M8 14C6.8 13 6 11.5 6 9.8C6 6.6 8.7 4 12 4C15.3 4 18 6.6 18 9.8C18 11.5 17.2 13 16 14C15.3 14.6 15 15.1 15 16H9C9 15.1 8.7 14.6 8 14Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "review") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 4H17M7 8H17M7 12H13M6 3H18C19.1 3 20 3.9 20 5V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 14C14.2 14 16 12.2 16 10C16 7.8 14.2 6 12 6C9.8 6 8 7.8 8 10C8 12.2 9.8 14 12 14ZM5 20C5.9 17.7 8.6 16 12 16C15.4 16 18.1 17.7 19 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const AreaIcon = ({ icon }: { icon: NavItem["icon"] }) => {
  if (icon === "product") {
    return (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3L20 7.5L12 12L4 7.5L12 3ZM4 7.5V16.5L12 21V12M20 7.5V16.5L12 21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "idea") {
    return (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 18H15M10 21H14M8 14C6.8 13 6 11.5 6 9.8C6 6.6 8.7 4 12 4C15.3 4 18 6.6 18 9.8C18 11.5 17.2 13 16 14C15.3 14.6 15 15.1 15 16H9C9 15.1 8.7 14.6 8 14Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4H17M7 8H17M7 12H13M6 3H18C19.1 3 20 3.9 20 5V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const statusClassName: Record<ProductStatus, string> = {
  Active: "bg-emerald-50 border-emerald-200 text-emerald-700",
  Shipped: "bg-blue-50 border-blue-200 text-blue-700",
};

const ideaBadgeClassName: Record<IdeaTag, string> = {
  Idea: "bg-amber-100 text-amber-700",
  Prototype: "bg-violet-100 text-violet-700",
  Lab: "bg-sky-100 text-sky-700",
};

const AppHeader = ({ routeName }: { routeName: Route["name"] }) => (
  <header className="sticky top-0 z-30 border-b border-[#e5e5e5] bg-[#fafafa]/95 backdrop-blur-sm">
    <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 md:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded px-1 py-1 text-neutral-900"
        ariaLabel="返回首页"
      >
        <span className="inline-flex size-7 items-center justify-center rounded-xl bg-[#009966] text-sm font-bold text-white">
          P
        </span>
        <span className="text-lg font-medium tracking-tight">产品实验室</span>
      </Link>

      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const active = routeName === item.routeName;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative inline-flex h-8 items-center gap-1 rounded-xl px-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-50 text-[#009966]"
                  : "text-[#525252] hover:bg-white hover:text-neutral-900"
              }`}
            >
              <NavIcon icon={item.icon} active={active} />
              {item.label}
              {active && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#009966]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  </header>
);

const CubeIcon = () => (
  <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3L20 7.5L12 12L4 7.5L12 3ZM4 7.5V16.5L12 21V12M20 7.5V16.5L12 21"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SectionTitle = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: { label: string; to: string };
}) => (
  <div className="flex items-end justify-between gap-4">
    <div>
      <h2 className="text-[24px] font-medium leading-8 tracking-[0.0703px] text-[#171717]">
        {title}
      </h2>
      <p className="mt-1 text-base leading-6 tracking-[-0.3125px] text-[#525252]">
        {subtitle}
      </p>
    </div>
    {action ? (
      <Link
        to={action.to}
        className="inline-flex items-center gap-1 text-sm font-medium text-[#525252] transition-colors hover:text-[#009966]"
      >
        {action.label}
        <ArrowIcon />
      </Link>
    ) : null}
  </div>
);

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => (
  <span
    className={`inline-flex h-[22px] items-center rounded-full border px-2 text-xs font-medium ${statusClassName[status]}`}
  >
    {status}
  </span>
);

const ProductCover = ({ product }: { product: Product }) => {
  if (product.cover) {
    return (
      <img
        src={product.cover}
        alt={product.title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }

  const from = product.mockCover?.from ?? "#0f766e";
  const to = product.mockCover?.to ?? "#0f172a";
  const accent = product.mockCover?.accent ?? "#fb923c";

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div
        className="absolute -right-8 -top-8 size-32 rounded-full opacity-60"
        style={{ backgroundColor: accent }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.24),transparent_65%)]" />
      <div className="absolute inset-x-6 bottom-6">
        <p className="text-xs uppercase tracking-[0.16em] text-white/75">Mock Cover</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
          {product.mockCover?.title ?? product.title}
        </p>
        {product.mockCover?.subtitle ? (
          <p className="mt-1 text-sm text-white/85">{product.mockCover.subtitle}</p>
        ) : null}
      </div>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => (
  <article className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
    <div className="relative h-56 bg-neutral-100">
      <ProductCover product={product} />
      <div className="absolute left-3 top-3">
        <ProductStatusBadge status={product.status} />
      </div>
    </div>

    <div className="space-y-3 px-5 py-5">
      <div className="flex items-center justify-between text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <span className="rounded bg-[#f5f5f5] px-2 py-0.5 text-[#525252]">
            {product.version}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <CalendarIcon />
            {product.lastUpdatedLabel}
          </span>
        </div>
        <span className="text-[#a3a3a3]">{product.category}</span>
      </div>

      <h3 className="text-[18px] font-semibold leading-[24.75px] tracking-[-0.02em] text-[#171717]">
        {product.title}
      </h3>
      <p className="text-sm leading-6 text-[#525252]">{product.summary}</p>
      <Link
        to={product.url}
        className="inline-flex items-center gap-1 text-sm font-medium text-[#009966]"
      >
        查看详情
        <ArrowIcon />
      </Link>
    </div>
  </article>
);

const ReviewCard = ({ item }: { item: Review }) => (
  <article className="rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-[inset_3px_0_0_0_#3b82f6]">
    <div className="flex flex-wrap items-center gap-2 text-xs text-[#737373]">
      <span className="rounded bg-[#f5f5f5] px-2 py-0.5 text-[#404040]">{item.product}</span>
      <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700">{item.version}</span>
      <span className="inline-flex items-center gap-1">
        <CalendarIcon />
        {item.date}
      </span>
    </div>

    <h3 className="mt-3 text-[18px] font-semibold leading-[24.75px] tracking-[-0.02em] text-[#171717]">
      {item.title}
    </h3>

    <div className="mt-3 grid gap-4 text-xs leading-[19.5px] text-[#404040] md:grid-cols-3">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3px] text-[#009966]">
          做了什么
        </p>
        <p>{item.done}</p>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3px] text-blue-600">
          影响
        </p>
        <p>{item.impact}</p>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3px] text-orange-500">
          下一步
        </p>
        <p>{item.next}</p>
      </div>
    </div>
  </article>
);

const FilterBar = ({
  label,
  items,
}: {
  label: string;
  items: Array<{ label: string; active?: boolean }>;
}) => (
  <div className="rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-4">
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[#404040]">
        <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 6H20L14 13V19L10 21V13L4 6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </span>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${
            item.active
              ? "border-[#009966] bg-[#009966] text-white shadow-sm"
              : "border-[#d4d4d4] bg-white text-[#404040]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  </div>
);

const HomePage = () => {
  const latestReviews = REVIEWS.slice(0, 3);

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
            className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-[#009966] px-7 text-base font-medium tracking-[-0.3125px] text-white shadow-sm"
          >
            <CubeIcon />
            查看产品
          </Link>
          <Link
            to="/reviews"
            className="inline-flex h-[52px] items-center gap-2 rounded-xl px-7 text-base font-medium tracking-[-0.3125px] text-[#404040]"
          >
            阅读复盘
            <ArrowIcon />
          </Link>
        </div>
      </div>

      <div className="border-b border-[#e5e5e5] pb-20 pt-20">
        <SectionTitle title="三个专区" subtitle="不同阶段的内容，统一的品质追求" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {HOME_AREAS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group rounded-2xl border border-[#e5e5e5] bg-white px-6 pb-6 pt-6 transition hover:-translate-y-0.5 hover:border-[#d4d4d4]"
            >
              <div className="mb-4 flex items-start justify-between">
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-xl ${item.iconClassName}`}
                >
                  <AreaIcon icon={item.icon} />
                </span>
                <span className="text-neutral-400 transition group-hover:text-neutral-600">
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

const ProductsPage = () => (
  <section className="space-y-6 pb-14 pt-8">
    <div>
      <h1 className="text-[36px] font-semibold leading-[40px] tracking-[-0.03em] text-[#171717]">
        产品
      </h1>
      <p className="mt-3 text-base text-[#525252]">已上线且持续迭代的项目</p>
    </div>

    <FilterBar
      label="状态"
      items={[
        { label: "全部", active: true },
        { label: "Active" },
        { label: "Shipped" },
        { label: "Archived" },
      ]}
    />
    <FilterBar
      label="分类"
      items={[
        { label: "全部", active: true },
        { label: "游戏" },
        { label: "健康" },
        { label: "工具" },
      ]}
    />

    <div className="grid gap-5 lg:grid-cols-2">
      {PRODUCTS.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);

const IdeasPage = () => (
  <section className="space-y-6 pb-14 pt-8">
    <div>
      <h1 className="text-[36px] font-semibold leading-[40px] tracking-[-0.03em] text-[#171717]">
        想法
      </h1>
      <p className="mt-3 text-base text-[#525252]">想法、实验和原型，还在探索中的创意</p>
    </div>

    <FilterBar
      label="阶段"
      items={[
        { label: "全部", active: true },
        { label: "Idea" },
        { label: "Prototype" },
        { label: "Lab" },
      ]}
    />

    <div className="grid gap-4 md:grid-cols-2">
      {IDEAS.map((idea) => (
        <article key={idea.id} className="rounded-2xl border border-[#cfcfcf] bg-white p-4">
          <div className="flex items-start justify-between">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ideaBadgeClassName[idea.type]}`}
            >
              {idea.type}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-[#737373]">
              <CalendarIcon />
              {idea.date}
            </span>
          </div>

          <h3 className="mt-3 text-[18px] font-semibold leading-[24.75px] tracking-[-0.02em] text-[#171717]">
            {idea.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#525252]">{idea.summary}</p>

          <div className="mt-3 rounded border-l-2 border-amber-400 bg-[linear-gradient(90deg,#fff7d6,rgba(255,247,214,0.25))] px-3 py-2">
            <p className="text-xs font-semibold text-orange-500">↗ 下一步</p>
            <p className="mt-1 text-xs leading-5 text-[#525252]">{idea.nextStep}</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[#e5e5e5] bg-[#f5f5f5] px-2 py-0.5 text-xs text-[#525252]"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>

    <div className="rounded-2xl border border-amber-300 bg-[#fffdf5] px-4 py-3 text-sm text-[#404040]">
      <p>
        💡 <span className="font-semibold">关于想法专区：</span>
        这里展示的是正在探索中的想法和实验。它们可能会变成正式产品，也可能只是一次尝试。
      </p>
    </div>
  </section>
);

const ReviewsPage = () => (
  <section className="space-y-6 pb-14 pt-8">
    <div>
      <h1 className="text-[36px] font-semibold leading-[40px] tracking-[-0.03em] text-[#171717]">
        复盘
      </h1>
      <p className="mt-3 text-base text-[#525252]">
        每次发版的复盘与反思，记录产品迭代的思考过程
      </p>
    </div>

    <FilterBar
      label="产品"
      items={[
        { label: "全部产品", active: true },
        { label: "卡牌游戏" },
        { label: "热量摄入 app" },
      ]}
    />

    <div className="space-y-4">
      {REVIEWS.map((item) => (
        <ReviewCard key={item.id} item={item} />
      ))}
    </div>
  </section>
);

const AboutPage = () => (
  <section className="space-y-6 pb-14 pt-8">
    <div>
      <h1 className="text-[36px] font-semibold leading-[40px] tracking-[-0.03em] text-[#171717]">
        关于
      </h1>
      <p className="mt-3 text-base text-[#525252]">
        个人产品实践者，持续用设计和开发把想法变成可用的产品
      </p>
    </div>

    <article className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
      <h2 className="text-2xl font-semibold text-[#171717]">我是谁</h2>
      <p className="mt-3 text-sm leading-7 text-[#525252]">
        我是一个偏产品工程方向的独立开发者，关注从想法验证、交互设计到上线迭代的完整流程。
        这里记录的是“做出来”的过程，而不只是“想一想”。
      </p>
    </article>

    <article className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
      <h2 className="text-2xl font-semibold text-[#171717]">我在做什么</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4">
          <p className="text-sm font-semibold text-[#009966]">产品</p>
          <p className="mt-1 text-sm leading-6 text-[#525252]">
            当前主要产品为卡牌游戏与热量摄入 app，持续迭代体验和留存。
          </p>
        </div>
        <div className="rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4">
          <p className="text-sm font-semibold text-blue-600">想法</p>
          <p className="mt-1 text-sm leading-6 text-[#525252]">
            定期做小型实验和快速原型，验证新交互与新功能是否值得投入。
          </p>
        </div>
        <div className="rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4">
          <p className="text-sm font-semibold text-orange-500">复盘</p>
          <p className="mt-1 text-sm leading-6 text-[#525252]">
            每次发版都记录“做了什么、带来什么影响、下一步做什么”。
          </p>
        </div>
      </div>
    </article>

    <article className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
      <h2 className="text-2xl font-semibold text-[#171717]">联系方式</h2>
      <p className="mt-3 text-sm leading-7 text-[#525252]">
        欢迎交流产品、设计和工程实现。你可以通过下面方式联系我。
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={EMAIL_LINK}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#009966] px-4 text-sm font-medium text-white"
        >
          <MailIcon />
          Email
        </Link>
        <Link
          to={GITHUB_LINK}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm font-medium text-[#404040]"
        >
          <GitHubIcon />
          GitHub
          <ExternalIcon />
        </Link>
        <Link
          to={TWITTER_LINK}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm font-medium text-[#404040]"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M18 4H21L14 11L22 20H16L11 14.5L6.5 20H3.5L11 11L3.5 4H9.5L14 9L18 4Z"
              fill="currentColor"
            />
          </svg>
          Twitter
          <ExternalIcon />
        </Link>
      </div>
    </article>
  </section>
);

const NotFoundPage = () => (
  <section className="flex min-h-[50vh] items-center justify-center pb-14 pt-8">
    <div className="rounded-2xl border border-[#e5e5e5] bg-white px-8 py-12 text-center">
      <p className="text-6xl font-semibold tracking-tight text-[#171717]">404</p>
      <p className="mt-2 text-[#525252]">页面不存在</p>
      <div className="mt-5">
        <Link
          to="/"
          className="inline-flex h-10 items-center rounded-xl bg-[#009966] px-4 text-sm font-medium text-white"
        >
          返回首页
        </Link>
      </div>
    </div>
  </section>
);

const AppFooter = () => (
  <footer className="border-t border-[#e5e5e5] bg-[#fafafa]">
    <div className="mx-auto w-full max-w-[1280px] px-4 py-12 md:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[#171717]">产品实验室</h3>
          <p className="mt-2 text-sm text-[#525252]">
            打磨有趣的产品，记录开发过程，分享设计思考
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={EMAIL_LINK}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm font-medium text-[#404040]"
          >
            <MailIcon />
            Email
          </Link>
          <Link
            to={GITHUB_LINK}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm font-medium text-[#404040]"
          >
            <GitHubIcon />
            GitHub
            <ExternalIcon />
          </Link>
        </div>
      </div>

      <div className="mt-8 border-t border-[#e5e5e5] pt-6 text-center text-sm text-[#737373]">
        © 2026 产品实验室. All rights reserved.
      </div>
    </div>
  </footer>
);

export const App = () => {
  const pathname = usePathname();
  const route = useMemo(() => resolveRoute(pathname), [pathname]);

  useEffect(() => {
    const titleMap: Record<Route["name"], string> = {
      home: "产品实验室",
      products: "产品 - 产品实验室",
      ideas: "想法 - 产品实验室",
      reviews: "复盘 - 产品实验室",
      about: "关于 - 产品实验室",
      "not-found": "404 - 产品实验室",
    };
    document.title = titleMap[route.name];
  }, [route.name]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-[Inter,Noto_Sans_SC,PingFang_SC,Microsoft_YaHei,sans-serif] text-[#171717]">
      <AppHeader routeName={route.name} />
      <main className="mx-auto w-full max-w-[1280px] px-4 md:px-8">
        {route.name === "home" ? <HomePage /> : null}
        {route.name === "products" ? <ProductsPage /> : null}
        {route.name === "ideas" ? <IdeasPage /> : null}
        {route.name === "reviews" ? <ReviewsPage /> : null}
        {route.name === "about" ? <AboutPage /> : null}
        {route.name === "not-found" ? <NotFoundPage /> : null}
      </main>
      <AppFooter />
    </div>
  );
};
