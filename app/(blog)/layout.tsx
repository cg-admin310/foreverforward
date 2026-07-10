import { Navbar } from "@/components/marketing/navbar";
import { FooterPremium } from "@/components/marketing/footer-premium";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <FooterPremium />
    </>
  );
}
