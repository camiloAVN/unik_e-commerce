import Link from "next/link";
import { RegisterForm } from "./ui/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Crear cuenta</h1>
        <p className="mt-1.5 text-sm text-[#444444]">Únete a UNIK y empieza a comprar</p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-sm text-[#444444]">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/auth/login"
          className="text-[#D61C1C] font-medium hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
