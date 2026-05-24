import { LuUser } from 'react-icons/lu';

export default function AdminUsersPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Usuarios</h1>
        <p className="text-sm text-[#444444] mt-1">Gestión de cuentas y roles</p>
      </div>

      <div className="bg-white rounded-lg border border-[#E5E5E5] px-6 py-16 flex flex-col items-center justify-center text-center gap-3">
        <LuUser className="w-10 h-10 text-[#E5E5E5]" />
        <p className="text-sm font-medium text-[#444444]">El listado de usuarios aparecerá aquí</p>
      </div>
    </>
  );
}
