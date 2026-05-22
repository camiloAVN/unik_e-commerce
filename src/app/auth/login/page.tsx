import Link from "next/link";
import { LoginForm } from "./ui/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Iniciar sesión</h1>
        <p className="mt-1.5 text-sm text-[#444444]">Ingresa a tu cuenta UNIK</p>
      </div>

      <LoginForm />

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
