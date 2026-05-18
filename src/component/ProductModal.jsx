// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { X, Save, Package } from "lucide-react";
// import api from "../redux/instance";
// import { setBrandsData, setCategoriesData } from "../redux/productSlice";

// export default function ProductModal({ isOpen, onClose, onSuccess }) {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [metadataLoading, setMetadataLoading] = useState(false);

//   const categories = useSelector((state) => state.products?.categories);
//   const brands = useSelector((state) => state.products?.brands);

//   const initialFormState = {
//     name: "",
//     category: "",
//     brand: "",
//     purchasePrice: "",
//     sellingPrice: "",
//     stock: "",
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   // 2. Conditional Fetching: Runs only when modal opens and Redux data is missing
//   useEffect(() => {
//     if (!isOpen) return;

//     const fillMissingMetadata = async () => {
//       const needsCategories = categories.length === 0;
//       const needsBrands = brands.length === 0;

//       if (!needsCategories && !needsBrands) return;

//       setMetadataLoading(true);
//       try {
//         const catPromise = needsCategories ? api.get("/category") : null;
//         const brandPromise = needsBrands ? api.get("/brand") : null;

//         const [catRes, brandRes] = await Promise.all([
//           catPromise,
//           brandPromise,
//         ]);

//         if (catRes) {
//           dispatch(setCategoriesData(catRes.data?.data || catRes.data || []));
//         }
//         if (brandRes) {
//           dispatch(setBrandsData(brandRes.data?.data || brandRes.data || []));
//         }
//       } catch (err) {
//         console.error("Failed to lazy-load modal dropdown metadata:", err);
//       } finally {
//         setMetadataLoading(false);
//       }
//     };

//     fillMissingMetadata();
//   }, [isOpen, categories.length, brands.length, dispatch]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post("/product/create", formData);

//       if (res.data?.success || res.status === 201) {
//         setFormData(initialFormState);
//         onSuccess();
//         onClose();
//       }
//     } catch (err) {
//       console.error("Critical Error: Asset creation entry failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelClose = () => {
//     setFormData(initialFormState);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-brand-900/20 backdrop-blur-md animate-in fade-in duration-300">
//       <div className="bg-white w-full max-w-3xl rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col">
//         {/* Header */}
//         <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
//           <div>
//             <h2 className="text-base sm:text-lg 2xl:text-2xl font-black text-brand-900 tracking-tight">
//               New Product Entry
//             </h2>
//             <p className="text-[9px] 2xl:text-[15px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 sm:mt-1">
//               Add asset to inventory
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={handleCancelClose}
//             className="p-1.5 sm:p-2 hover:bg-white rounded-xl transition-colors cursor-pointer"
//           >
//             <X size={18} className="text-slate-400 sm:w-5 sm:h-5" />
//           </button>
//         </div>

//         {/* Form Body Layout (Scrollable on extremely small mobile screens) */}
//         <form
//           onSubmit={handleSubmit}
//           className="px-5 py-4 sm:p-8 space-y-3 sm:space-y-5 overflow-y-auto flex-1"
//         >
//           {/* Name Field */}
//           <div className="space-y-1 sm:space-y-2">
//             <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
//               Product Title
//             </label>
//             <div className="relative">
//               <Package
//                 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
//                 size={16}
//               />
//               <input
//                 required
//                 type="text"
//                 disabled={metadataLoading}
//                 value={formData.name}
//                 placeholder={
//                   metadataLoading
//                     ? "Loading dropdown configurations..."
//                     : "e.g. Samsung Galaxy S24 Ultra"
//                 }
//                 className="h-11 sm:h-14 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all disabled:opacity-60"
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* Category & Brand Grid Dropdowns */}
//           <div className="grid grid-cols-2 gap-3 sm:gap-5">
//             <div className="space-y-1 sm:space-y-2">
//               <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
//                 Category
//               </label>
//               <select
//                 required
//                 disabled={metadataLoading}
//                 value={formData.category}
//                 className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-slate-600 transition-all cursor-pointer disabled:opacity-60"
//                 onChange={(e) =>
//                   setFormData({ ...formData, category: e.target.value })
//                 }
//               >
//                 <option value="">
//                   {metadataLoading ? "Syncing..." : "Select Category"}
//                 </option>
//                 {categories.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.name || c.categoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="space-y-1 sm:space-y-2">
//               <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
//                 Brand
//               </label>
//               <select
//                 required
//                 disabled={metadataLoading}
//                 value={formData.brand}
//                 className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-slate-600 transition-all cursor-pointer disabled:opacity-60"
//                 onChange={(e) =>
//                   setFormData({ ...formData, brand: e.target.value })
//                 }
//               >
//                 <option value="">
//                   {metadataLoading ? "Syncing..." : "Select Brand"}
//                 </option>
//                 {brands.map((b) => (
//                   <option key={b._id} value={b._id}>
//                     {b.brandName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Pricing & Stock Fields */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-5">
//             <div className="space-y-1 sm:space-y-2">
//               <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
//                 Purchase
//               </label>
//               <input
//                 required
//                 type="number"
//                 min="0"
//                 step="any"
//                 disabled={metadataLoading}
//                 value={formData.purchasePrice}
//                 placeholder="0.00"
//                 className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-brand-900 transition-all disabled:opacity-60"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     purchasePrice:
//                       e.target.value === "" ? "" : Number(e.target.value),
//                   })
//                 }
//               />
//             </div>

//             <div className="space-y-1 sm:space-y-2">
//               <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
//                 Selling
//               </label>
//               <input
//                 required
//                 type="number"
//                 min="0"
//                 step="any"
//                 disabled={metadataLoading}
//                 value={formData.sellingPrice}
//                 placeholder="0.00"
//                 className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-brand-900 transition-all disabled:opacity-60"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     sellingPrice:
//                       e.target.value === "" ? "" : Number(e.target.value),
//                   })
//                 }
//               />
//             </div>

//             <div className="space-y-1 sm:space-y-2">
//               <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
//                 Stock
//               </label>
//               <input
//                 required
//                 type="number"
//                 min="0"
//                 disabled={metadataLoading}
//                 value={formData.stock}
//                 placeholder="0"
//                 className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-brand-900 transition-all disabled:opacity-60"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     stock: e.target.value === "" ? "" : Number(e.target.value),
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* Action Footer */}
//           <div className="flex gap-3 pt-4 border-t border-slate-50 flex-shrink-0">
//             <button
//               type="button"
//               onClick={handleCancelClose}
//               className="flex-1 h-11 sm:h-14 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
//             >
//               Discard
//             </button>
//             <button
//               disabled={loading || metadataLoading}
//               type="submit"
//               className="flex-1 h-11 sm:h-14 bg-brand-900 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-widest text-white hover:bg-brand-800 transition-all sm:shadow-lg shadow-brand-900/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
//             >
//               {loading ? (
//                 "Processing..."
//               ) : (
//                 <>
//                   <Save size={14} className="sm:w-4 sm:h-4" /> Save
//                 </>
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Small background overlay loader to look highly polished during metadata load */}
//         {metadataLoading && (
//           <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] pointer-events-none z-10 flex items-center justify-center" />
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Save, Package } from "lucide-react";
import api from "../redux/instance";
import { setBrandsData, setCategoriesData } from "../redux/productSlice";

export default function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  productData,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(false);

  const isEditMode = !!productData;

  const categories = useSelector((state) => state.products?.categories) || [];
  const brands = useSelector((state) => state.products?.brands) || [];

  const initialFormState = {
    name: "",
    category: "",
    brand: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    status: "active",
  };

  const [formData, setFormData] = useState(() => ({
    name: productData?.name || "",
    category: productData?.category?._id || productData?.category || "",
    brand: productData?.brand?._id || productData?.brand || "",
    purchasePrice: productData?.purchasePrice ?? "",
    sellingPrice: productData?.sellingPrice ?? "",
    stock: productData?.stock ?? "",
    status: productData?.status || "active",
  }));

  useEffect(() => {
    if (!isOpen) return;

    const fillMissingMetadata = async () => {
      const needsCategories = categories.length === 0;
      const needsBrands = brands.length === 0;

      if (!needsCategories && !needsBrands) return;

      setMetadataLoading(true);
      try {
        const catPromise = needsCategories ? api.get("/category") : null;
        const brandPromise = needsBrands ? api.get("/brand") : null;

        const [catRes, brandRes] = await Promise.all([
          catPromise,
          brandPromise,
        ]);

        if (catRes) {
          dispatch(setCategoriesData(catRes.data?.data || catRes.data || []));
        }
        if (brandRes) {
          dispatch(setBrandsData(brandRes.data?.data || brandRes.data || []));
        }
      } catch (err) {
        console.error("Failed to lazy-load modal dropdown metadata:", err);
      } finally {
        setMetadataLoading(false);
      }
    };

    fillMissingMetadata();
  }, [isOpen, categories.length, brands.length, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (isEditMode) {
        res = await api.patch(`/product/${productData._id}`, formData);
      } else {
        res = await api.post("/product/create", formData);
      }

      if (res.data?.success || res.status === 200 || res.status === 201) {
        setFormData(initialFormState);
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(
        "Critical Error: Asset record action operation failed:",
        err,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-brand-900/20 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <div>
            <h2 className="text-base sm:text-lg 2xl:text-2xl font-black text-brand-900 tracking-tight">
              {isEditMode ? "Modify Product Details" : "New Product Entry"}
            </h2>
            <p className="text-[9px] 2xl:text-[15px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 sm:mt-1">
              {isEditMode
                ? "Apply changes to active inventory data"
                : "Add asset to inventory"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancelClose}
            className="p-1.5 sm:p-2 hover:bg-white rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} className="text-slate-400 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Form Body Layout (Scrollable on extremely small mobile screens) */}
        <form
          onSubmit={handleSubmit}
          className="px-5 py-4 sm:p-8 space-y-3 sm:space-y-5 overflow-y-auto flex-1"
        >
          {/* Name Field */}
          <div className="space-y-1 sm:space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
              Product Title
            </label>
            <div className="relative">
              <Package
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                required
                type="text"
                disabled={metadataLoading}
                value={formData.name}
                placeholder={
                  metadataLoading
                    ? "Loading dropdown configurations..."
                    : "e.g. Samsung Galaxy S24 Ultra"
                }
                className="h-11 sm:h-14 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all disabled:opacity-60"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Category & Brand Grid Dropdowns */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            <div className="space-y-1 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
                Category
              </label>
              <select
                required
                disabled={metadataLoading}
                value={formData.category}
                className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-slate-600 transition-all cursor-pointer disabled:opacity-60"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">
                  {metadataLoading ? "Syncing..." : "Select Category"}
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name || c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
                Brand
              </label>
              <select
                required
                disabled={metadataLoading}
                value={formData.brand}
                className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-slate-600 transition-all cursor-pointer disabled:opacity-60"
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              >
                <option value="">
                  {metadataLoading ? "Syncing..." : "Select Brand"}
                </option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.brandName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing, Stock & Status Grid Fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-5">
            <div className="space-y-1 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
                Purchase
              </label>
              <input
                required
                type="number"
                min="0"
                step="any"
                disabled={metadataLoading}
                value={formData.purchasePrice}
                placeholder="0.00"
                className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-brand-900 transition-all disabled:opacity-60"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchasePrice:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
                Selling
              </label>
              <input
                required
                type="number"
                min="0"
                step="any"
                disabled={metadataLoading}
                value={formData.sellingPrice}
                placeholder="0.00"
                className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-brand-900 transition-all disabled:opacity-60"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellingPrice:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
                Stock
              </label>
              <input
                required
                type="number"
                min="0"
                disabled={metadataLoading}
                value={formData.stock}
                placeholder="0"
                className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-brand-900 transition-all disabled:opacity-60"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Operational Status Control Column */}
            <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1">
                Status
              </label>
              <select
                required
                disabled={metadataLoading}
                value={formData.status}
                className="h-11 sm:h-14 w-full px-3 sm:px-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-brand-500 outline-none font-bold text-slate-600 transition-all cursor-pointer disabled:opacity-60"
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="active">Active Available</option>
                <option value="inactive">Inactive Suspended</option>
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-50 flex-shrink-0">
            <button
              type="button"
              onClick={handleCancelClose}
              className="flex-1 h-11 sm:h-14 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              disabled={loading || metadataLoading}
              type="submit"
              className="flex-1 h-11 sm:h-14 bg-brand-900 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-widest text-white hover:bg-brand-800 transition-all sm:shadow-lg shadow-brand-900/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Save size={14} className="sm:w-4 sm:h-4" />{" "}
                  {isEditMode ? "Apply Changes" : "Save"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Background loader during lazy load tracking execution */}
        {metadataLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] pointer-events-none z-10 flex items-center justify-center" />
        )}
      </div>
    </div>
  );
}
