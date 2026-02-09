import type { Post } from "../types";
import { PostList } from "./post-list";

export const BlogListPage = ({ posts }: { posts: Post[] }) => (
  <section>
    <h1 className="mb-3 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
      复盘与博客
    </h1>
    <p className="mb-8 text-sm leading-relaxed text-neutral-600 sm:text-base">
      记录产品迭代、技术实践与设计思考。
    </p>
    <PostList posts={posts} />
  </section>
);
