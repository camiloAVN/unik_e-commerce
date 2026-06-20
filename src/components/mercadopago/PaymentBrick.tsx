'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Payment } from '@mercadopago/sdk-react';
import { LuCircleAlert } from 'react-icons/lu';
import { createPaymentPreference, processPayment } from '@/actions';

interface Props {
  orderId: string;
  amount: number;
  payerEmail?: string;
  /** Se llama cuando el pago queda aprobado o en proceso (orden ya creada). */
  onPaymentComplete?: () => void;
}

export const PaymentBrick = ({ orderId, amount, payerEmail, onPaymentComplete }: Props) => {
  const router = useRouter();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Crea la preferencia (habilita el botón de billetera Mercado Pago) al montar.
  useEffect(() => {
    let active = true;
    createPaymentPreference(orderId).then((resp) => {
      if (!active) return;
      if (resp.ok && resp.preferenceId) {
        setPreferenceId(resp.preferenceId);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
          <LuCircleAlert className="w-4 h-4 text-[#D61C1C] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#D61C1C]">{errorMessage}</p>
        </div>
      )}

      <Payment
        initialization={{
          amount: Math.round(amount),
          ...(preferenceId ? { preferenceId } : {}),
          payer: payerEmail ? { email: payerEmail } : undefined,
        }}
        customization={{
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            // El botón de billetera Mercado Pago solo aparece si hay preferenceId.
            ...(preferenceId ? { mercadoPago: 'all' as const } : {}),
          },
        }}
        onSubmit={async ({ formData }) => {
          setErrorMessage('');
          const resp = await processPayment(orderId, formData);

          // Aprobado o en proceso → la orden ya existe; vamos a la confirmación.
          if (resp.ok) {
            if (onPaymentComplete) onPaymentComplete();
            else router.replace(`/orders/${orderId}`);
            return;
          }

          setErrorMessage(resp.message ?? 'El pago no pudo procesarse.');
          // Rechazamos para que el Brick mantenga el formulario activo.
          throw new Error(resp.message ?? 'Pago rechazado');
        }}
        onError={(error) => {
          console.error('PaymentBrick', error);
          setErrorMessage('Ocurrió un error con el formulario de pago.');
        }}
      />
    </div>
  );
};
