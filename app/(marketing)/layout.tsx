import { Navbar } from "@/components/marketing/navbar";
import { FooterPremium } from "@/components/marketing/footer-premium";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <FooterPremium />
    </SmoothScrollProvider>
  );
}
