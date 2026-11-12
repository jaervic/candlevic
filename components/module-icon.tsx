import {
  Bitcoin,
  Brain,
  ChartCandlestick,
  Gauge,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import type { CourseModule } from "@/content/modulos";

const MAP = {
  brain: Brain,
  landmark: Landmark,
  timer: Timer,
  chart: ChartCandlestick,
  trend: TrendingUp,
  gauge: Gauge,
  heart: HeartHandshake,
  shield: ShieldCheck,
  target: Target,
  bitcoin: Bitcoin,
} as const;

export function ModuleIcon({
  name,
  className,
}: {
  name: CourseModule["icon"];
  className?: string;
}) {
  const Icon = MAP[name];
  return <Icon className={className} />;
}
