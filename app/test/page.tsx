import { ProfileTest } from "@/components/profile/profile-test";

export const metadata = {
  alternates: { canonical: "/test" },
  title: "¿Qué trader eres?",
  description:
    "Cinco preguntas para descubrir qué estilo de trading encaja contigo y un plan de 30 días.",
};

export default function TestPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <ProfileTest />
    </div>
  );
}
