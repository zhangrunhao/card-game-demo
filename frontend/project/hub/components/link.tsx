import type { MouseEvent, ReactNode } from "react";
import { withBase } from "../routing";

export const Link = ({
  to,
  children,
  className,
  ariaLabel,
  onClick,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const isExternal =
    to.startsWith("http://") ||
    to.startsWith("https://") ||
    to.startsWith("mailto:") ||
    to.startsWith("tel:");
  if (isExternal) {
    return (
      <a
        className={className}
        href={to}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  const href = withBase(to);
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    if (window.location.pathname !== href) {
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };
  return (
    <a
      className={className}
      href={href}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
};
