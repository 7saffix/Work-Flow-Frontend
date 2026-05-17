import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit3, Trash2, Folder, X } from "lucide-react";
import api from "../redux/instance";
import {
  setCategoriesData,
  addCategory,
  setProductLoading,
} from "../redux/productSlice";

export default function Categories() {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.products.categories);
  const loading = useSelector((state) => state.products.loading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    dispatch(setProductLoading(true));
    try {
      const res = await api.get("/category");
      dispatch(setCategoriesData(res.data.data));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      dispatch(setProductLoading(false));
    }
  };

  useEffect(() => {
    loadCategories();
  }, [dispatch]);

  const handleNameChange = (e) => {
    const name = e.target.value;

    setFormData({ name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post("/category", formData);

      dispatch(addCategory(res.data.data));
      setIsModalOpen(false);
      setFormData({ name: "", slug: "" });
    } catch (err) {
      console.error("Failed to create category:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row lg:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-brand-900">
            Product Categories
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Organize and segment inventory units into groupings
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
          Add Category
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Category Name
                </th>

                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map((category) => (
                <tr
                  key={category._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-brand-900 border border-slate-200">
                        <Folder size={18} />
                      </div>
                      <p className="text-sm font-black text-brand-900">
                        {category.name}
                      </p>
                    </div>
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

        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Sync Data...
            </p>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 pt-8 flex justify-between items-center">
              <h2 className="text-xl font-black text-brand-900">
                Add New Category
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g., Electronics, Home & Kitchen"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-brand-900 outline-none transition-all focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-14 rounded-2xl bg-brand-900 text-sm font-bold text-white hover:bg-brand-800 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
