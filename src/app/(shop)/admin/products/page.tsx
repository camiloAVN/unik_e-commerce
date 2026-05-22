
import { IoEye } from "react-icons/io5";
import { FaReceipt} from "react-icons/fa";
import { LuSearch, LuFilter } from "react-icons/lu";
import Link from "next/link";
import { getPaginationProductWithImages } from "@/actions";
import { Pagination, ProductImage } from "@/components";
import { currencyFormat } from "@/utils";

interface Props{

  searchParams:Promise<{
    page?: string;
  }>
}


export default async function ProductsAdminPage ({searchParams}:Props)  {

  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1;

  const {products, currentPage, totalPages}= await getPaginationProductWithImages({page});

  return (
    <div className="min-h-screen">

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        
        {/* Filters and Search */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100/50 shadow-xl mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <FaReceipt className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">All products</h2>
                <p className="text-xs sm:text-sm text-gray-500">{products.length} total orders</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all text-sm"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
                <LuFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              <div className="flex justify-center items-center">
                <Link href="/admin/product/new" className="bg-blue-400 rounded p-2">
                  Nuevo producto
                </Link>
            </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-100/50 shadow-xl overflow-hidden">
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titulo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Genero
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inventario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tallas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/product/${product.slug}`}>
                        <ProductImage
                          src={product.ProductImage[0]?.url}
                          width={80}
                          height={80}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/product/${product.slug}`}  
                        className="hover:underline"
                      >
                        {product.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currencyFormat(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.inStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.sizes.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{product.id}</h3>
                    <p className="text-xs text-gray-500">{product.categoryId}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{product.slug}</p>
                    <p className="text-xs text-gray-500">email</p>
                  </div>
                  <p className="font-semibold text-gray-800">${product.inStock}</p>
                </div>
                
                <Link
                  href={`/orders/${product.slug}`}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-lime-100 hover:bg-lime-200 text-lime-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <IoEye className="w-4 h-4" />
                  <span>View Order</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <Pagination totalPages={totalPages}/>

      </div>
    </div>
  );
};