export type ProductStatus = "Active" | "Shipped";
export type ProductCategory = "游戏" | "健康";

export type ProductMockCover = {
  title: string;
  subtitle: string;
  from: string;
  to: string;
  accent: string;
};

export type Product = {
  id: string;
  title: string;
  summary: string;
  description: string;
  url: string;
  cover?: string;
  mockCover?: ProductMockCover;
  category: ProductCategory;
  status: ProductStatus;
  version: string;
  lastUpdated: string;
  lastUpdatedLabel: string;
};
