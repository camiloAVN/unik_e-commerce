import {  IoLockClosed } from "react-icons/io5";
import { LuUser} from "react-icons/lu";
import { FaAngleLeft } from "react-icons/fa";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";

export default function CheckoutPage () {



  return (
    <div className="min-h-screen bg-black/50 rounded-4xl">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 rounded-2xl backdrop-blur-lg border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <FaAngleLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Checkout
                </h1>
                <p className="text-sm text-gray-500">Complete your purchase</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <IoLockClosed className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Forms */}
          <div className="space-y-6">
            
            {/* Customer Information */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 border border-gray-100/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <LuUser className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
              </div>
              
              <div className="overflow-y-auto p-4 h-[500px] space-y-4">
                <ProductsInCart/>

              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
            <PlaceOrder/>

          </div>
        </div>
      </div>
    </div>
  );
};