import { Demo } from "@/components/demo/demo";
import { Disclaimer } from "@/components/disclaimer";

export const metadata = {
  title: "Trading demo",
  description:
    "Practica con 10.000 $ virtuales: compra, vende, mide tu P&L y anota tus emociones. Sin órdenes reales.",
};

export default function DemoPage() {
  return (
    <div className="space-y-8">
      <Demo />
      <footer className="border-t border-line pt-4">
        <Disclaimer />
      </footer>
    </div>
  );
}
