import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit3, Trash2, Layers } from "lucide-react";

import api from "../redux/instance";
import BrandModal from "../component/brandModal";
import {
  addBrand,
  setBrandsData,
  setProductLoading,
} from "../redux/productSlice";

export default function Brands() {
  const dispatch = useDispatch();

  const brands = useSelector((state) => state.products?.brands) || [];
  // const loading = useSelector((state) => state.products?.loading) || false;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadBrands = async () => {
    dispatch(setProductLoading(true));
    try {
      const res = await api.get("/brand");
      dispatch(setBrandsData(res.data.data));
    } catch (err) {
      console.error("Failed to fetch brands:", err);
      dispatch(setProductLoading(false));
    }
  };

  useEffect(() => {
    loadBrands();
  }, [dispatch]);

  // Executed when child form fires onBrandAdded callback
  // const handleBrandAdded = (newBrand) => {
  //   dispatch(addBrand(newBrand));
  // };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row lg:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-brand-900">
            Product Brands
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage and assign brand labels to inventory entries
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-3 rounded-2xl bg-brand-900 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand-900/10 transition-all hover:-translate-y-1 hover:bg-brand-800"
        >
          <Plus
            size={18}
            className="transition-transform group-hover:rotate-90"
          />
          Add Brand
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Brand Name
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Description
                </th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {brands?.map((brand) => (
                <tr
                  key={brand._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-brand-900 border border-slate-200">
                        <Layers size={18} />
                      </div>
                      <p className="text-sm font-black text-brand-900">
                        {brand.brandName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium max-w-[300px] truncate">
                    {brand.description || "—"}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-xl transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Sync Data...
            </p>
          </div>
        )} */}
      </div>

      {/* Render the Separate Modal Component */}
      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBrandAdded={(newBrand) => dispatch(addBrand(newBrand))}
      />
    </div>
  );
}
