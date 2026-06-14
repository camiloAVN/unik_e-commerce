"use client";

import { useState } from "react";
import { LuMail, LuLock, LuEye, LuEyeOff, LuUser } from "react-icons/lu";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import { loginData, registerUser } from "@/actions";

type FormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const inputBase =
  "w-full pl-9 pr-4 py-2.5 border border-[#E5E5E5] focus:border-[#111111] focus:outline-none transition-colors text-sm text-[#111111] bg-white rounded";

const inputError = "border-[#D61C1C]";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const password = watch("password");

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setServerError("");
    const resp = await registerUser(data.name, data.email, data.password);
    if (!resp.ok) {
      setServerError(resp.message);
      return;
    }
    await loginData(data.email.toLowerCase(), data.password);
    window.location.replace("/");
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {serverError && (
        <p className="text-xs text-[#D61C1C] p-3 bg-red-50 border border-red-100 rounded">
          {serverError}
        </p>
      )}

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5">
          Nombre
        </label>
        <div className="relative">
          <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input
            type="text"
            placeholder="Tu nombre"
            {...register("name", {
              required: "El nombre es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
              maxLength: { value: 100, message: "Máximo 100 caracteres" },
            })}
            maxLength={100}
            className={clsx(inputBase, { [inputError]: errors.name })}
          />
        </div>
        {errors.name && (
          <p className="mt-1.5 text-xs text-[#D61C1C]">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5">
          Correo electrónico
        </label>
        <div className="relative">
          <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Correo electrónico inválido",
              },
            })}
            className={clsx(inputBase, { [inputError]: errors.email })}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-[#D61C1C]">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5">
          Contraseña
        </label>
        <div className="relative">
          <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
            })}
            className={clsx(inputBase, "pr-10", { [inputError]: errors.password })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444444] hover:text-[#111111] transition-colors"
          >
            {showPassword ? <LuEye className="w-4 h-4" /> : <LuEyeOff className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-[#D61C1C]">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5">
          Confirmar contraseña
        </label>
        <div className="relative">
          <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
            {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: v => v === password || "Las contraseñas no coinciden",
            })}
            className={clsx(inputBase, "pr-10", { [inputError]: errors.confirmPassword })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444444] hover:text-[#111111] transition-colors"
          >
            {showConfirm ? <LuEye className="w-4 h-4" /> : <LuEyeOff className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-[#D61C1C]">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={clsx(
          "w-full text-sm font-semibold py-3 rounded transition-colors mt-2",
          isSubmitting
            ? "bg-[#E5E5E5] text-[#444444] cursor-not-allowed"
            : "bg-[#D61C1C] hover:bg-[#b81818] text-white"
        )}
      >
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
};
