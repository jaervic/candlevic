import { Demo } from "@/components/demo/demo";

export const metadata = {
  alternates: { canonical: "/demo" },
  title: "Trading demo",
  description:
    "Practica con 10.000 $ virtuales: compra, vende, mide tu P&L y anota tus emociones. Sin órdenes reales.",
};

export default function DemoPage() {
  return (
    <div className="space-y-8">
      <Demo />
    </div>
  );
}
