import { CartModal, Footer, SideBar, TopMenu, WhatsAppButton } from "@/components";


export default function ShopLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <main className="min-h-screen bg-white">
      <TopMenu/>
      <SideBar/>
      <CartModal/>
      <div className="px-5 sm:px-10 max-w-7xl mx-auto">
        {children}
      </div>
      <Footer/>
      <WhatsAppButton/>
    </main>

  );
}
