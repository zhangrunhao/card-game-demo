import ideasData from "../data/ideas.json";
import productsData from "../data/products.json";
import reviewsData from "../data/reviews.json";
import type { Idea, Product, Review } from "../types";

export const PRODUCTS = productsData as Product[];
export const IDEAS = ideasData as Idea[];
export const REVIEWS = reviewsData as Review[];
