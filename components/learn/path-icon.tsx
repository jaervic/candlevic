import {
  Bitcoin,
  CandlestickChart,
  Shield,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { PathIcon as PathIconName } from "@/content/rutas";

const ICONS: Record<PathIconName, LucideIcon> = {
  sparkles: Sparkles,
  shield: Shield,
  chart: CandlestickChart,
  bitcoin: Bitcoin,
};

export function PathIcon({
  icon,
  className,
}: {
  icon: PathIconName;
  className?: string;
}) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden="true" />;
}
