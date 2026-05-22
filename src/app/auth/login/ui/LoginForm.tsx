"use client";

import { useActionState, useEffect, useState } from "react";
import { LuMail, LuLock, LuEye, LuEyeOff, LuCircleAlert } from "react-icons/lu";
import { login } from "@/actions";
import clsx from "clsx";

export const LoginForm = () => {
  const [errorMessage, formAction, isPending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (errorMessage === "Success") {
      window.location.replace("/");
    }
  }, [errorMessage]);

  const hasError = !!errorMessage && errorMessage !== "Success";

  const inputBase =
    "w-full pl-9 pr-4 py-2.5 border focus:outline-none transition-colors text-sm bg-white rounded";

  return (
    <form action={formAction} className="space-y-5">

      {/* Error banner */}
      {hasError && (
        <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded">
          <LuCircleAlert className="w-4 h-4 text-[#D61C1C] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#D61C1C]">{errorMessage}</p>
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input
            id="email"
            name="email"
            type="email"
            disabled={isPending}
            autoComplete="email"
            placeholder="tu@correo.com"
            className={clsx(inputBase, "border-[#E5E5E5] text-[#111111] focus:border-[#111111]")}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5"
        >
          Contraseña
        </label>
        <div className="relative">
          <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            disabled={isPending}
            autoComplete="current-password"
            placeholder="••••••••"
            className={clsx(inputBase, "pr-10 border-[#E5E5E5] text-[#111111] focus:border-[#111111]")}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444444] hover:text-[#111111] transition-colors"
          >
            {showPassword
              ? <LuEye className="w-4 h-4" />
              : <LuEyeOff className="w-4 h-4" />
            }
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className={clsx(
          "w-full text-sm font-semibold py-3 rounded transition-colors",
          isPending
            ? "bg-[#E5E5E5] text-[#444444] cursor-not-allowed"
            : "bg-[#D61C1C] hover:bg-[#b81818] text-white"
        )}
      >
        {isPending ? "Verificando..." : "Iniciar sesión"}
      </button>
    </form>
  );
};
