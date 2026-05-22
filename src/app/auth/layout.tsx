import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen flex">

      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[42%] bg-[#111111] flex-col justify-between p-12 flex-shrink-0">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          UNIK
        </Link>

        <div>
          <div className="w-8 h-px bg-[#D61C1C] mb-6" />
          <p className="text-2xl font-semibold text-white leading-snug">
            Productos importados<br />para Colombia.
          </p>
          <p className="mt-4 text-sm text-[#888888] leading-relaxed max-w-xs">
            Calidad y estilo sin igual. Seleccionados para ofrecerte lo mejor del mercado internacional.
          </p>
        </div>

        <p className="text-xs text-[#555555]">
          © {new Date().getFullYear()} UNIK. Todos los derechos reservados.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-white">

        {/* Mobile logo */}
        <div className="lg:hidden w-full max-w-[400px] mb-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#111111]">
            UNIK
          </Link>
        </div>

        {/* Form card */}
        <div className="w-full max-w-[400px]">
          {children}
        </div>

        {/* Back to store */}
        <div className="mt-10 w-full max-w-[400px]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#444444] hover:text-[#111111] transition-colors"
          >
            <LuArrowLeft className="w-3.5 h-3.5" />
            Volver a la tienda
          </Link>
        </div>
      </div>

    </div>
  );
}
