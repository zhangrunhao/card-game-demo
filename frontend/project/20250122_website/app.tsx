import { marked } from "marked";
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import productCover from "./assets/product-card-demo.svg";

type Post = {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  html: string;
};

type Product = {
  id: string;
  title: string;
  summary: string;
  description: string;
  url: string;
  cover: string;
};

type Route =
  | { name: "home" }
  | { name: "blogs" }
  | { name: "blog"; id: string }
  | { name: "products" }
  | { name: "product"; id: string }
  | { name: "not-found" };

const RAW_BASE = import.meta.env.BASE_URL ?? "/";
const BASE_PATH = RAW_BASE === "/" ? "" : RAW_BASE.replace(/\/$/, "");

const RSS_URL = "https://zhangrh.top/rss.xml";
const GITHUB_URL = "https://github.com/";

const PRODUCTS: Product[] = [
  {
    id: "card-game-demo",
    title: "卡牌游戏在线 Demo",
    summary: "即时对战的卡牌策略玩法，支持在线体验与对战。",
    description:
      "一个轻量级的在线卡牌策略原型，用于验证即时对战与回合节奏的可玩性。",
    url: "https://zhangrh.top/",
    cover: productCover,
  },
  {
    id: "focus-notes",
    title: "专注笔记",
    summary: "记录灵感与任务的极简写作空间。",
    description:
      "一个去干扰的写作页面，支持快速记录、标签整理与多端同步的最小体验。",
    url: "https://zhangrh.top/",
    cover: productCover,
  },
  {
    id: "habit-tracker",
    title: "习惯打卡面板",
    summary: "用可视化方式追踪每日习惯。",
    description: "提供轻量打卡与连续天数统计，帮助建立可持续的日常节奏。",
    url: "https://zhangrh.top/",
    cover: productCover,
  },
  {
    id: "team-roadmap",
    title: "团队路线图",
    summary: "协作整理产品里程碑与优先级。",
    description:
      "集中展示关键版本节点与负责人，方便同步计划与上下游协作。",
    url: "https://zhangrh.top/",
    cover: productCover,
  },
  {
    id: "lightweight-analytics",
    title: "轻量数据面板",
    summary: "关注核心指标的最小仪表盘。",
    description:
      "为小型项目提供访问趋势、留存、转化等关键指标的即时概览。",
    url: "https://zhangrh.top/",
    cover: productCover,
  },
];

const RAW_POSTS = import.meta.glob("./content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

marked.setOptions({
  breaks: true,
  mangle: false,
  headerIds: false,
});

const POSTS: Post[] = Object.entries(RAW_POSTS)
  .map(([filePath, raw]) => parsePost(filePath, raw))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const NAV_ITEMS = [
  { label: "个人首页", to: "/" },
  { label: "博客文章", to: "/blogs" },
  { label: "产品列表", to: "/products" },
];

const DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const stripBase = (pathname: string) => {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    const next = pathname.slice(BASE_PATH.length);
    if (!next) {
      return "/";
    }
    return next.startsWith("/") ? next : `/${next}`;
  }
  return pathname || "/";
};

const normalizePath = (pathname: string) => {
  const trimmed = stripBase(pathname).replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
};

const withBase = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return BASE_PATH ? `${BASE_PATH}${normalized}` : normalized;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return DATE_FORMATTER.format(date);
};

const resolveRoute = (pathname: string): Route => {
  const path = normalizePath(pathname);
  if (path === "/") {
    return { name: "home" };
  }
  if (path === "/blogs") {
    return { name: "blogs" };
  }
  if (path === "/products") {
    return { name: "products" };
  }
  const blogMatch = path.match(/^\/blogs\/([^/]+)$/);
  if (blogMatch) {
    return { name: "blog", id: blogMatch[1] };
  }
  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    return { name: "product", id: productMatch[1] };
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

const Link = ({
  to,
  children,
  className,
  ariaLabel,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) => {
  const isExternal = to.startsWith("http://") || to.startsWith("https://");
  if (isExternal) {
    return (
      <a
        className={className}
        href={to}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  const href = withBase(to);
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (window.location.pathname !== href) {
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };
  return (
    <a className={className} href={href} onClick={handleClick} aria-label={ariaLabel}>
      {children}
    </a>
  );
};

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path
      d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
      fill="currentColor"
    />
  </svg>
);

const AppHeader = ({ currentPath }: { currentPath: string }) => {
  const normalized = normalizePath(currentPath);
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.to === "/" ? normalized === "/" : normalized.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`transition-all hover:text-neutral-800 flex align-middle relative py-1 px-2 m-1 ${
                    isActive ? "text-neutral-900 font-semibold" : "text-neutral-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
};

const AppFooter = () => (
  <footer className="mb-16">
    <ul className="text-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0">
      <li>
        <Link
          to={RSS_URL}
          className="flex items-center transition-all hover:text-neutral-800"
        >
          <ArrowIcon />
          <p className="ml-2 h-7">rss</p>
        </Link>
      </li>
      <li>
        <Link
          to={GITHUB_URL}
          className="flex items-center transition-all hover:text-neutral-800"
        >
          <ArrowIcon />
          <p className="ml-2 h-7">github</p>
        </Link>
      </li>
    </ul>
  </footer>
);

const PostList = ({ posts }: { posts: Post[] }) => (
  <div>
    {posts.map((post) => (
      <Link key={post.id} to={`/blogs/${post.id}`} className="flex flex-col space-y-1 mb-4">
        <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
          <p className="text-neutral-600 w-[100px] tabular-nums">
            {formatDate(post.date)}
          </p>
          <p className="text-neutral-900 tracking-tight">{post.title}</p>
        </div>
      </Link>
    ))}
  </div>
);

const ProductGrid = ({ products }: { products: Product[] }) => (
  <div className="grid grid-cols-1 gap-5 min-[576px]:grid-cols-2 min-[768px]:grid-cols-3">
    {products.map((product) => (
      <Link
        key={product.id}
        to={`/products/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        ariaLabel={product.title}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
          <img
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            src={product.cover}
            alt={product.title}
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="text-sm font-semibold leading-5 text-neutral-900">
            {product.title}
          </h3>
          <p className="text-sm leading-5 text-neutral-600">{product.summary}</p>
        </div>
      </Link>
    ))}
  </div>
);

const HomePage = () => (
  <section>
    <h1 className="mb-8 text-2xl font-semibold tracking-tighter">个人介绍</h1>
    <p className="mb-6 text-neutral-800">
      我是一名前端开发者，喜欢各种各样的技术，最近想做点实际有用的东西，这个网站用来记录自己的天马行空
      的想法、产品日记，还有实际上线的产品列表。
    </p>
    <div className="mt-10">
      <h2 className="mb-6 text-xl font-semibold tracking-tight">文档列表</h2>
      <PostList posts={POSTS} />
    </div>
    <div className="mt-12">
      <h2 className="mb-6 text-xl font-semibold tracking-tight">产品列表</h2>
      <ProductGrid products={PRODUCTS} />
    </div>
  </section>
);

const BlogListPage = () => (
  <section>
    <h1 className="mb-8 text-2xl font-semibold tracking-tighter">博客</h1>
    <PostList posts={POSTS} />
  </section>
);

const BlogDetailPage = ({ post }: { post: Post }) => (
  <section>
    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Blog</p>
    <h1 className="mt-3 text-2xl font-semibold tracking-tighter">{post.title}</h1>
    <p className="mt-2 text-sm text-neutral-600">{formatDate(post.date)}</p>
    <div
      className="mt-6 text-[15px] leading-7 text-neutral-800 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tighter [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_ul]:pl-5 [&_ol]:pl-5 [&_ul]:list-disc [&_ol]:list-decimal [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:py-0.5"
      dangerouslySetInnerHTML={{ __html: post.html }}
    />
  </section>
);

const ProductListPage = () => (
  <section>
    <h1 className="mb-8 text-2xl font-semibold tracking-tighter">产品列表</h1>
    <ProductGrid products={PRODUCTS} />
  </section>
);

const ProductDetailPage = ({ product }: { product: Product }) => (
  <section>
    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Product</p>
    <h1 className="mt-3 text-2xl font-semibold tracking-tighter">{product.title}</h1>
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_200px]">
      <div>
        <p className="text-neutral-800 mb-4">{product.description}</p>
        <p className="text-sm text-neutral-600">
          产品地址：
          <Link to={product.url} className="ml-2 underline">
            {product.url}
          </Link>
        </p>
      </div>
      <img
        className="w-full rounded-xl border border-neutral-200/80"
        src={product.cover}
        alt={product.title}
      />
    </div>
  </section>
);

const NotFoundPage = () => (
  <section className="py-20 text-center">
    <h1 className="text-4xl font-semibold tracking-tight">404</h1>
    <p className="mt-3 text-neutral-600">这个页面没有找到。</p>
    <div className="mt-8">
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-full border border-neutral-900 px-4 py-2 text-sm transition-colors hover:bg-neutral-900 hover:text-white"
      >
        回到首页
      </Link>
    </div>
  </section>
);

export const App = () => {
  const pathname = usePathname();
  const route = useMemo(() => resolveRoute(pathname), [pathname]);

  useEffect(() => {
    const titleMap: Record<Route["name"], string> = {
      home: "首页",
      blogs: "博客",
      blog: "博客",
      products: "产品",
      product: "产品",
      "not-found": "404",
    };
    document.title = titleMap[route.name];
  }, [route]);

  const blogPost = route.name === "blog" ? POSTS.find((post) => post.id === route.id) : null;
  const product =
    route.name === "product" ? PRODUCTS.find((item) => item.id === route.id) : null;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <main className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto flex flex-col">
        <AppHeader currentPath={pathname} />
        <div className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          {route.name === "home" && <HomePage />}
          {route.name === "blogs" && <BlogListPage />}
          {route.name === "blog" && blogPost && <BlogDetailPage post={blogPost} />}
          {route.name === "products" && <ProductListPage />}
          {route.name === "product" && product && <ProductDetailPage product={product} />}
          {route.name === "blog" && !blogPost && <NotFoundPage />}
          {route.name === "product" && !product && <NotFoundPage />}
          {route.name === "not-found" && <NotFoundPage />}
          <AppFooter />
        </div>
      </main>
    </div>
  );
};

function parsePost(filePath: string, raw: string): Post {
  const frontmatterMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*/);
  const frontmatter = frontmatterMatch ? parseFrontmatter(frontmatterMatch[1]) : {};
  const content = frontmatterMatch ? raw.slice(frontmatterMatch[0].length) : raw;
  const fileName = filePath.split("/").pop()?.replace(/\.md$/, "") ?? "post";
  const id = frontmatter.slug || fileName;
  const title = frontmatter.title || fileName;
  const date = frontmatter.date || "1970-01-01";
  const summary = frontmatter.summary || "";
  const html = marked.parse(content.trim());

  return {
    id,
    title,
    date,
    summary,
    content: content.trim(),
    html,
  };
}

function parseFrontmatter(source: string) {
  const result: Record<string, string> = {};
  source.split("\n").forEach((line) => {
    const [rawKey, ...rest] = line.split(":");
    if (!rawKey || rest.length === 0) {
      return;
    }
    const key = rawKey.trim();
    const value = rest.join(":").trim();
    if (key && value) {
      result[key] = value;
    }
  });
  return result;
}
