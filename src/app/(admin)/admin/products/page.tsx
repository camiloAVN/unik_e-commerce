import { LuPackage } from 'react-icons/lu';

export default function AdminProductsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Productos</h1>
        <p className="text-sm text-[#444444] mt-1">Gestión del catálogo de productos</p>
      </div>

      <div className="bg-white rounded-lg border border-[#E5E5E5] px-6 py-16 flex flex-col items-center justify-center text-center gap-3">
        <LuPackage className="w-10 h-10 text-[#E5E5E5]" />
        <p className="text-sm font-medium text-[#444444]">El listado de productos aparecerá aquí</p>
      </div>
    </>
  );
}
