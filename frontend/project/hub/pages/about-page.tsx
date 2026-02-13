import { EMAIL_LINK, GITHUB_LINK } from "../shared/constants";
import { ExternalIcon, GitHubIcon, MailIcon } from "../components/icons";
import { Link } from "../components/link";

export const AboutPage = () => (
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
      <h2 className="text-2xl font-semibold text-[#171717]">联系方式</h2>
      <p className="mt-3 text-sm leading-7 text-[#525252]">
        欢迎交流产品、设计和工程实现。
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
      </div>
    </article>
  </section>
);
