import type { Route } from "./route";
import type { HubButton } from "./tracking";

export const EMAIL_LINK = "mailto:runhaozhang.dev@gmail.com";
export const GITHUB_LINK = "https://github.com/zhangrunhao";

export type NavItem = {
  label: string;
  to: string;
  routeName: Exclude<Route["name"], "not-found" | "product-detail" | "home">;
  icon: "product" | "idea" | "review" | "about";
  button: Extract<
    HubButton,
    "nav_product" | "nav_ideas" | "nav_reviews" | "nav_about"
  >;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "产品",
    to: "/products",
    routeName: "products",
    icon: "product",
    button: "nav_product",
  },
  {
    label: "想法",
    to: "/ideas",
    routeName: "ideas",
    icon: "idea",
    button: "nav_ideas",
  },
  {
    label: "复盘",
    to: "/reviews",
    routeName: "reviews",
    icon: "review",
    button: "nav_reviews",
  },
  {
    label: "关于",
    to: "/about",
    routeName: "about",
    icon: "about",
    button: "nav_about",
  },
];

export const HOME_AREAS = [
  {
    to: "/products",
    title: "产品",
    description: "已上线且持续迭代",
    icon: "product",
    iconClassName: "bg-emerald-100 text-emerald-600",
    hoverIconClassName: "group-hover:bg-emerald-600 group-hover:text-white",
    cardClassName: "border border-[#e5e5e5] bg-white",
    hoverBorderClassName: "hover:border-emerald-500",
    hoverArrowClassName: "group-hover:text-emerald-600",
  },
  {
    to: "/ideas",
    title: "想法",
    description: "想法、实验和原型",
    icon: "idea",
    iconClassName: "bg-amber-100 text-amber-600",
    hoverIconClassName: "group-hover:bg-amber-600 group-hover:text-white",
    cardClassName:
      "border-2 border-dashed border-[#d4d4d4] bg-[rgba(255,251,235,0.3)]",
    hoverBorderClassName: "hover:border-amber-400",
    hoverArrowClassName: "group-hover:text-amber-600",
  },
  {
    to: "/reviews",
    title: "复盘",
    description: "每次发版的思考",
    icon: "review",
    iconClassName: "bg-blue-100 text-blue-600",
    hoverIconClassName: "group-hover:bg-blue-600 group-hover:text-white",
    cardClassName: "border border-[#e5e5e5] bg-white",
    hoverBorderClassName: "hover:border-blue-500",
    hoverArrowClassName: "group-hover:text-blue-600",
  },
] as const;
