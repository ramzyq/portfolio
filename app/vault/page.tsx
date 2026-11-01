import type { Metadata } from "next";
import { Vault } from "@/components/site/Vault";

export const metadata: Metadata = {
  title: "Vault",
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return (
    <main id="main" className="pt-10 md:pt-16">
      <Vault />
    </main>
  );
}
