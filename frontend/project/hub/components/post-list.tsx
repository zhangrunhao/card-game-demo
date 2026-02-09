import { formatDate } from "../utils/date";
import type { Post } from "../types";
import { Link } from "./link";

export const PostList = ({ posts }: { posts: Post[] }) => (
  <div className="space-y-2">
    {posts.map((post) => (
      <Link
        key={post.id}
        to={`/blogs/${post.id}`}
        className="block rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-neutral-200 hover:bg-white"
      >
        <div className="flex w-full flex-col gap-1 md:flex-row md:items-center md:gap-3">
          <p className="w-[120px] text-sm tabular-nums text-neutral-500">
            {formatDate(post.date)}
          </p>
          <p className="text-neutral-900 tracking-tight">{post.title}</p>
        </div>
      </Link>
    ))}
  </div>
);
