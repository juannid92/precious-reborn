import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
  current: string;
  className?: string;
};

export function PageBreadcrumb({ current, className }: Props) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="text-[11px] uppercase tracking-[0.28em] text-ink/55">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="hover:text-gold-deep transition-colors">
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-ink/80">{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
