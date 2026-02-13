import { EMAIL_LINK, GITHUB_LINK } from "../shared/constants";
import { ExternalIcon, GitHubIcon, MailIcon } from "./icons";
import { Link } from "./link";

export const AppFooter = () => (
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
