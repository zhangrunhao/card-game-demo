import { ArrowIcon } from "./icons";
import { Link } from "./link";

export const SectionTitle = ({
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
