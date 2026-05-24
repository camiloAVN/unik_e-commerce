import { LuChartBar, LuClipboardList, LuPackage, LuTag, LuUser, LuUsers } from 'react-icons/lu';

const statCards = [
  { label: 'Categorías', icon: LuTag,           href: '/admin/categories', value: '—' },
  { label: 'Productos',  icon: LuPackage,       href: '/admin/products',   value: '—' },
  { label: 'Órdenes',   icon: LuClipboardList,  href: '/admin/orders',     value: '—' },
  { label: 'Clientes',  icon: LuUsers,          href: '/admin/customers',  value: '—' },
  { label: 'Usuarios',  icon: LuUser,           href: '/admin/users',      value: '—' },
];

export default function AdminDashboard() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Estadísticas</h1>
        <p className="text-sm text-[#444444] mt-1">Resumen general del negocio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
        {statCards.map(({ label, icon: Icon, value }) => (
          <div
            key={label}
            className="bg-white rounded-lg border border-[#E5E5E5] px-6 py-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-[#D61C1C]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#444444]">{label}</p>
              <p className="text-2xl font-bold text-[#111111] mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#E5E5E5] px-6 py-8 flex flex-col items-center justify-center text-center gap-3">
        <LuChartBar className="w-10 h-10 text-[#E5E5E5]" />
        <p className="text-sm font-medium text-[#444444]">Las gráficas y métricas aparecerán aquí próximamente</p>
      </div>
    </>
  );
}
