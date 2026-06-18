"use client";

import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? "", {
      locale: "es-CO",
    });
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
};
