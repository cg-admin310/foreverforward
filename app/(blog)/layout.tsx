import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
