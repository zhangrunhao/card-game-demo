import { Link } from "../components/link";

export const NotFoundPage = () => (
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
