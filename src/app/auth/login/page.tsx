import Link from "next/link";
import { LoginForm } from "./ui/LoginForm";

type Props = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { redirectTo } = await searchParams;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Iniciar sesión</h1>
        <p className="mt-1.5 text-sm text-[#444444]">Ingresa a tu cuenta UNIK</p>
      </div>

      <LoginForm redirectTo={redirectTo} />

      <p className="mt-6 text-sm text-[#444444]">
        ¿No tienes cuenta?{" "}
        <Link
          href="/auth/new-account"
          className="text-[#D61C1C] font-medium hover:underline"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
