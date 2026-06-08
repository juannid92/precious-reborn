import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type Props = {
  current: string;
  className?: string;
  tone?: "light" | "dark";
};

export function PageBreadcrumb({ current, className, tone = "light" }: Props) {
  const isDark = tone === "dark";
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList
        className={cn(
          "text-[11px] uppercase tracking-[0.28em]",
          isDark ? "text-bone/60" : "text-ink/55",
        )}
      >
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              to="/"
              className={cn(
                "transition-colors",
                isDark ? "hover:text-gold" : "hover:text-gold-deep",
              )}
            >
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className={isDark ? "text-bone/90" : "text-ink/80"}>
            {current}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
