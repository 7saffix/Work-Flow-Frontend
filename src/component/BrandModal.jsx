import { useState } from "react";
import { X } from "lucide-react";
import api from "../redux/instance";

export default function BrandModal({ isOpen, onClose, onBrandAdded }) {
  const [formData, setFormData] = useState({ brandName: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brandName.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post("/brand/create", formData);
      const newBrand = res.data?.data || res.data;
      onBrandAdded(newBrand);
      setFormData({ brandName: "", description: "" });
      onClose();
    } catch (err) {
      console.error("Failed to create brand:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="px-8 pt-8 flex justify-between items-center">
          <h2 className="text-xl font-black text-brand-900">Add New Brand</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Brand Name
            </label>
            <input
              type="text"
              required
              value={formData.brandName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, brandName: e.target.value }))
              }
              placeholder="e.g., Apple, Nike, Samsung"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-brand-900 outline-none transition-all focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief details about the manufacturer..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-brand-900 outline-none transition-all focus:border-brand-500 focus:bg-white resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-14 rounded-2xl bg-brand-900 text-sm font-bold text-white hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
