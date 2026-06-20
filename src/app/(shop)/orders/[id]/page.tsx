import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LuCircleCheck,
  LuClock,
  LuMapPin,
  LuReceipt,
  LuCalendar,
  LuPackage,
  LuArrowRight,
  LuShoppingBag,
} from 'react-icons/lu';
import { ProductImage } from '@/components';
import { currencyFormat } from '@/utils';
import { getOrderById } from '@/actions';
import { auth } from '@/auth';

interface Props {
  params: Promise<{ id: string }>;
}

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' }).format(d);

export default async function OrderPage({ params }: Props) {
  const id = (await params).id;

  const [session, { ok, order }] = await Promise.all([auth(), getOrderById(id)]);
  if (!ok || !order) redirect('/');

  const address = order.orderAddress;
  const paid = order.isPaid;
  const shortId = id.split('-').at(-1)?.toUpperCase();

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-10">
      {/* Estado del pago */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-8 text-center">
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              paid ? 'bg-green-50' : 'bg-amber-50'
            }`}
          >
            {paid ? (
              <LuCircleCheck className="w-8 h-8 text-green-600" />
            ) : (
              <LuClock className="w-8 h-8 text-amber-600" />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#111111]">
          {paid ? '¡Pago confirmado!' : 'Pago pendiente'}
        </h1>
        <p className="text-sm text-[#444444] mt-2 max-w-md mx-auto">
          {paid
            ? `Gracias por tu compra. Enviamos la confirmación${
                session?.user?.email ? ` a ${session.user.email}` : ''
              }.`
            : 'Tu pago se está procesando. Te avisaremos por correo cuando se confirme.'}
        </p>

        {/* Meta */}
        <div className="mt-6 bg-[#F8F9FA] rounded-lg grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E5]">
          <div className="px-4 py-3">
            <p className="text-xs text-[#888] mb-0.5">Pedido</p>
            <p className="font-semibold text-[#111111] text-sm font-mono">#{shortId}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-[#888] mb-0.5">Fecha</p>
            <p className="font-semibold text-[#111111] text-sm">{fmtDate(order.createdAt)}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-[#888] mb-0.5">Total</p>
            <p className="font-semibold text-[#111111] text-sm">{currencyFormat(order.total)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Columna izquierda: pago + envío */}
        <div className="space-y-5">
          {/* Detalles del pago */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-4">
              <LuReceipt className="w-4 h-4 text-[#D61C1C]" />
              <h2 className="font-semibold text-[#111111] text-sm">Detalles del pago</h2>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-[#444444]">Estado</dt>
                <dd>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      paid ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {paid ? 'Pagado' : 'Pendiente'}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-[#444444]">
                  <LuCalendar className="w-3.5 h-3.5 text-[#888]" /> Fecha y hora
                </dt>
                <dd className="text-[#111111]">
                  {fmtDate(order.createdAt)} · {fmtTime(order.createdAt)}
                </dd>
              </div>
              {order.transactionId && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#444444]">Transacción</dt>
                  <dd className="text-[#111111] font-mono text-xs truncate">{order.transactionId}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Envío */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-4">
              <LuMapPin className="w-4 h-4 text-[#D61C1C]" />
              <h2 className="font-semibold text-[#111111] text-sm">Dirección de entrega</h2>
            </div>
            <div className="text-sm text-[#444444] space-y-0.5">
              <p className="font-semibold text-[#111111]">
                {address!.firstName} {address!.lastName}
              </p>
              <p>
                {address!.address}
                {address!.address2 ? `, ${address!.address2}` : ''}
              </p>
              <p>
                {address!.city}
                {address!.postalCode ? `, ${address!.postalCode}` : ''}
              </p>
              <p>Colombia</p>
              <p>{address!.phone}</p>
            </div>
          </div>
        </div>

        {/* Columna derecha: productos + totales */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
          <div className="flex items-center gap-2 mb-4">
            <LuPackage className="w-4 h-4 text-[#D61C1C]" />
            <h2 className="font-semibold text-[#111111] text-sm">
              Productos ({order.itemsInOrder})
            </h2>
          </div>

          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <div
                key={item.product.slug + '-' + (item.variantLabel ?? '')}
                className="flex items-start gap-3"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F8F9FA] border border-[#E5E5E5] flex-shrink-0">
                  <ProductImage
                    src={item.product.images[0]?.url}
                    width={56}
                    height={56}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[#111111] truncate">
                    {item.product.title}
                  </h3>
                  {item.variantLabel && (
                    <p className="text-xs text-[#888] mt-0.5">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-[#888] mt-0.5">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-[#111111] whitespace-nowrap">
                  {currencyFormat(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="border-t border-[#E5E5E5] mt-5 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#444444]">Subtotal</span>
              <span className="text-[#111111]">{currencyFormat(order.subTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#444444]">IVA (19%)</span>
              <span className="text-[#111111]">{currencyFormat(order.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#E5E5E5]">
              <span>Total</span>
              <span>{currencyFormat(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] text-white text-sm font-medium py-3 rounded-lg transition-colors"
        >
          <LuShoppingBag className="w-4 h-4" />
          Seguir comprando
        </Link>
        <Link
          href="/orders"
          className="flex-1 flex items-center justify-center gap-2 border border-[#E5E5E5] hover:bg-[#F8F9FA] text-[#111111] text-sm font-medium py-3 rounded-lg transition-colors"
        >
          Ver mis pedidos
          <LuArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
