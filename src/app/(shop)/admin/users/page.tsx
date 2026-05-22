export const revalidate = 0; 


import { FaReceipt} from "react-icons/fa";
import { LuSearch, LuFilter } from "react-icons/lu";
import {   getPaginatedUsers } from "@/actions";
import { redirect } from "next/navigation";
import { UsersTable } from "./ui/UsersTable";
import { Pagination } from "@/components";

export default async function UsersPage ()  {

  const {ok, users = []} = await getPaginatedUsers();

  if(!ok){
    redirect('/auth/login')
  }



  return (
    <div className="min-h-screen rounded-4xl">

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        
        {/* Filters and Search */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100/50 shadow-xl mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <FaReceipt className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Usuarios</h2>
                <p className="text-xs sm:text-sm text-gray-500">{users.length} total orders</p>
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
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-100/50 shadow-xl overflow-hidden">
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <UsersTable users={users}/>

          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{user.id}</h3>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  {user.image}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <p className="font-semibold text-gray-800">{user.password}</p>
                </div>
                
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <Pagination totalPages={3}/>

      </div>
    </div>
  );
};