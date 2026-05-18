// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Layers,
//   UserCheck,
//   Hash,
//   DollarSign,
//   Percent,
//   Truck,
//   Calculator,
//   Save,
//   Loader2,
//   Plus,
//   X,
//   Calendar,
// } from "lucide-react";
// import api from "../redux/instance";
// import {
//   setProductsData,
//   setCustomersData,
//   setSalesData,
// } from "../redux/productSlice";

// export default function Sell() {
//   const dispatch = useDispatch();

//   const products = useSelector((state) => state.products?.items) || [];
//   const customers = useSelector((state) => state.products?.customers) || [];
//   const salesHistory = useSelector((state) => state.products?.sales) || [];

//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);

//   const initialFormState = {
//     customer: "",
//     product: "",
//     quantity: "",
//     unitPrice: "",
//     vat: "",
//     discount: "",
//     shippingCost: "",
//   };
//   const [formData, setFormData] = useState(initialFormState);

//   useEffect(() => {
//     let isMounted = true;

//     const loadLedgerSystemRecords = async () => {
//       if (isMounted) setFetchLoading(true);
//       try {
//         const resHistory = await api.get("/sell");
//         dispatch(setSalesData(resHistory.data?.data || []));

//         if (products.length === 0) {
//           const resProd = await api.get("/product/?limit=1000");
//           if (isMounted) {
//             dispatch(
//               setProductsData({
//                 products:
//                   resProd.data?.data?.result || resProd.data?.data || [],
//                 stats: resProd.data?.data?.stats || null,
//                 totalPages: resProd.data?.data?.totalPages || 1,
//               }),
//             );
//           }
//         }

//         if (customers.length === 0) {
//           const resCust = await api.get("/customer");
//           if (isMounted) {
//             dispatch(
//               setCustomersData(resCust.data?.data || resCust.data || []),
//             );
//           }
//         }
//       } catch (err) {
//         console.error("Critical: Sales ledger population system failure:", err);
//       } finally {
//         if (isMounted) setFetchLoading(false);
//       }
//     };

//     loadLedgerSystemRecords();

//     return () => {
//       isMounted = false;
//     };
//   }, [dispatch, products.length, customers.length]);

//   const qty = Number(formData.quantity) || 0;
//   const price = Number(formData.unitPrice) || 0;
//   const vatValue = Number(formData.vat) || 0;
//   const discValue = Number(formData.discount) || 0;
//   const shipping = Number(formData.shippingCost) || 0;

//   const computedTotalPrice =
//     qty && price ? qty * price + vatValue - discValue + shipping : 0;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       ...formData,
//       quantity: Number(formData.quantity),
//       unitPrice: Number(formData.unitPrice),
//       vat: Number(formData.vat) || 0,
//       discount: Number(formData.discount) || 0,
//       shippingCost: Number(formData.shippingCost) || 0,
//       totalPrice: computedTotalPrice,
//     };

//     try {
//       const res = await api.post("/sell/create", payload);
//       if (res.data?.success || res.status === 201 || res.status === 200) {
//         setFormData(initialFormState);
//         setIsOpen(false);

//         const refreshHistory = await api.get("/sell");
//         dispatch(setSalesData(refreshHistory.data?.data || []));
//       }
//     } catch (err) {
//       console.error("Sales ledger write exception thrown:", err.response);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
//       {/* Page Content View Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-black text-brand-900 tracking-tight">
//             Outbound Sales Matrix
//           </h1>
//           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
//             Manage global customer invoice balances
//           </p>
//         </div>
//         <button
//           onClick={() => setIsOpen(true)}
//           className="h-11 px-5 bg-brand-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10 cursor-pointer self-start sm:self-center"
//         >
//           <Plus size={16} /> Record Sale
//         </button>
//       </div>

//       {/* Main Global Ledger Presentation Grid Layer */}
//       <div className="bg-white border border-slate-100 shadow-xl rounded-[24px] overflow-hidden relative">
//         <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white relative z-10">
//           <h2 className="text-sm font-black text-brand-900 uppercase tracking-wider">
//             Sales History Index
//           </h2>
//           <span className="bg-brand-50 text-brand-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
//             {salesHistory.length} Settled Logs
//           </span>
//         </div>

//         {fetchLoading && (
//           <div className="p-12 flex items-center justify-center gap-2 text-slate-400 font-medium text-sm">
//             <Loader2 size={16} className="animate-spin text-brand-500" />{" "}
//             Connecting to transaction server...
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           {salesHistory.length === 0 && !fetchLoading ? (
//             <div className="p-12 text-center text-slate-400 font-medium text-sm">
//               No recorded customer sales logs inside this global data channel.
//             </div>
//           ) : (
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                   <th className="p-4 pl-6">Date</th>
//                   <th className="p-4">Customer Client</th>
//                   <th className="p-4">Item Product</th>
//                   <th className="p-4 text-center">Qty</th>
//                   <th className="p-4 text-right pr-6">Settled Balance</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
//                 {salesHistory.map((item) => (
//                   <tr
//                     key={item._id}
//                     className="hover:bg-slate-50/50 transition-colors"
//                   >
//                     <td className="p-4 pl-6 text-slate-500 font-medium whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <Calendar size={14} className="text-slate-300" />
//                         {item.createdAt
//                           ? new Date(item.createdAt).toLocaleDateString()
//                           : "Historical"}
//                       </div>
//                     </td>
//                     <td className="p-4 font-bold text-brand-900">
//                       {item?.customer?.name}
//                     </td>
//                     <td className="p-4 text-slate-600 font-medium">
//                       {item?.product?.name || item?.product?.title}
//                     </td>
//                     <td className="p-4 text-center font-bold text-slate-700">
//                       {item.quantity}
//                     </td>
//                     <td className="p-4 text-right pr-6 font-black text-emerald-600">
//                       ৳{Number(item.totalPrice).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* ================= INLINE ENTRY MODAL LAYER ================= */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-brand-900/20 backdrop-blur-md animate-in fade-in duration-300">
//           <div className="bg-white w-full max-w-2xl rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden relative max-h-[95vh] overflow-y-auto">
//             <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
//               <div>
//                 <h2 className="text-base font-black text-brand-900 tracking-tight">
//                   Record Customer Sale
//                 </h2>
//                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
//                   Commit outgoing customer logistics entries
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFormData(initialFormState);
//                   setIsOpen(false);
//                 }}
//                 className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
//               >
//                 <X size={18} className="text-slate-400" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                     Target Customer
//                   </label>
//                   <div className="relative">
//                     <UserCheck
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
//                       size={16}
//                     />
//                     <select
//                       required
//                       value={formData.customer}
//                       className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all cursor-pointer appearance-none"
//                       onChange={(e) =>
//                         setFormData({ ...formData, customer: e.target.value })
//                       }
//                     >
//                       <option value="">-- Select Customer Client --</option>
//                       {customers.map((cust) => (
//                         <option key={cust._id} value={cust._id}>
//                           {cust.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                     Target Product
//                   </label>
//                   <div className="relative">
//                     <Layers
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
//                       size={16}
//                     />
//                     <select
//                       required
//                       value={formData.product}
//                       className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all cursor-pointer appearance-none"
//                       onChange={(e) =>
//                         setFormData({ ...formData, product: e.target.value })
//                       }
//                     >
//                       <option value="">-- Select Inventory Item --</option>
//                       {products.map((p) => (
//                         <option key={p._id} value={p._id}>
//                           {p.name || p.title}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                     Quantity (Units)
//                   </label>
//                   <div className="relative">
//                     <Hash
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
//                       size={16}
//                     />
//                     <input
//                       required
//                       type="number"
//                       min="1"
//                       value={formData.quantity}
//                       placeholder="e.g. 20"
//                       className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
//                       onChange={(e) =>
//                         setFormData({ ...formData, quantity: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                     Unit Selling Price (৳)
//                   </label>
//                   <div className="relative">
//                     <DollarSign
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
//                       size={16}
//                     />
//                     <input
//                       required
//                       type="number"
//                       min="0"
//                       value={formData.unitPrice}
//                       placeholder="e.g. 95000"
//                       className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
//                       onChange={(e) =>
//                         setFormData({ ...formData, unitPrice: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                     VAT Input (৳)
//                   </label>
//                   <div className="relative">
//                     <Percent
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
//                       size={16}
//                     />
//                     <input
//                       type="number"
//                       min="0"
//                       value={formData.vat}
//                       placeholder="0"
//                       className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
//                       onChange={(e) =>
//                         setFormData({ ...formData, vat: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                     Campaign Discount (৳)
//                   </label>
//                   <div className="relative">
//                     <Percent
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
//                       size={16}
//                     />
//                     <input
//                       type="number"
//                       min="0"
//                       value={formData.discount}
//                       placeholder="0"
//                       className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
//                       onChange={(e) =>
//                         setFormData({ ...formData, discount: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                     Delivery Shipping (৳)
//                   </label>
//                   <div className="relative">
//                     <Truck
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
//                       size={16}
//                     />
//                     <input
//                       type="number"
//                       min="0"
//                       value={formData.shippingCost}
//                       placeholder="e.g. 500"
//                       className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           shippingCost: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Total Invoice Aggregation Summary */}
//               <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between border border-slate-800 shadow-inner mt-2">
//                 <div className="flex items-center gap-2.5">
//                   <div className="p-2 bg-white/10 rounded-xl text-brand-400">
//                     <Calculator size={18} />
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
//                       Calculated Outbound Value
//                     </h3>
//                     <p className="text-[10px] font-bold text-slate-500 mt-0.5">
//                       Real-time dynamic formulation matrix
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-400">
//                   ৳{computedTotalPrice.toLocaleString()}
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-4 border-t border-slate-50">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setFormData(initialFormState);
//                     setIsOpen(false);
//                   }}
//                   className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
//                 >
//                   Discard Form
//                 </button>
//                 <button
//                   disabled={loading}
//                   type="submit"
//                   className="flex-1 h-11 bg-brand-900 rounded-xl text-[11px] font-black uppercase tracking-widest text-white hover:bg-brand-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-brand-900/10"
//                 >
//                   {loading ? (
//                     "Processing..."
//                   ) : (
//                     <>
//                       <Save size={14} /> Commit Entry
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Layers,
  UserCheck,
  Hash,
  DollarSign,
  Percent,
  Truck,
  Calculator,
  Save,
  Plus,
  X,
  Calendar,
} from "lucide-react";
import api from "../redux/instance";
import {
  setProductsData,
  setCustomersData,
  setSalesData,
} from "../redux/productSlice";

export default function Sell() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products?.items) || [];
  const customers = useSelector((state) => state.products?.customers) || [];
  const salesHistory = useSelector((state) => state.products?.sales) || [];

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const initialFormState = {
    customer: "",
    product: "",
    quantity: "",
    unitPrice: "",
    vat: "",
    discount: "",
    shippingCost: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    let isMounted = true;

    const loadLedgerSystemRecords = async () => {
      if (isMounted) setFetchLoading(true);
      try {
        const resHistory = await api.get("/sell");
        dispatch(setSalesData(resHistory.data?.data || []));

        if (products.length === 0) {
          const resProd = await api.get("/product/?limit=1000");
          if (isMounted) {
            dispatch(
              setProductsData({
                products:
                  resProd.data?.data?.result || resProd.data?.data || [],
                stats: resProd.data?.data?.stats || null,
                totalPages: resProd.data?.data?.totalPages || 1,
              }),
            );
          }
        }

        if (customers.length === 0) {
          const resCust = await api.get("/customer");
          if (isMounted) {
            dispatch(
              setCustomersData(resCust.data?.data || resCust.data || []),
            );
          }
        }
      } catch (err) {
        console.error("Critical: Sales ledger population system failure:", err);
      } finally {
        if (isMounted) setFetchLoading(false);
      }
    };

    loadLedgerSystemRecords();

    return () => {
      isMounted = false;
    };
  }, [dispatch, products.length, customers.length]);

  const qty = Number(formData.quantity) || 0;
  const price = Number(formData.unitPrice) || 0;
  const vatValue = Number(formData.vat) || 0;
  const discValue = Number(formData.discount) || 0;
  const shipping = Number(formData.shippingCost) || 0;

  const computedTotalPrice =
    qty && price ? qty * price + vatValue - discValue + shipping : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      vat: Number(formData.vat) || 0,
      discount: Number(formData.discount) || 0,
      shippingCost: Number(formData.shippingCost) || 0,
      totalPrice: computedTotalPrice,
    };

    try {
      const res = await api.post("/sell/create", payload);
      if (res.data?.success || res.status === 201 || res.status === 200) {
        setFormData(initialFormState);
        setIsOpen(false);

        const refreshHistory = await api.get("/sell");
        dispatch(setSalesData(refreshHistory.data?.data || []));
      }
    } catch (err) {
      console.error("Sales ledger write exception thrown:", err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 relative">
      {/* Page Content View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-900 tracking-tight">
            Outbound Sales Matrix
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Manage global customer invoice balances
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="h-11 px-5 bg-brand-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10 cursor-pointer self-start sm:self-center"
        >
          <Plus size={16} /> Record Sale
        </button>
      </div>

      {/* Main Global Ledger Presentation Grid Layer */}
      <div className="bg-white border border-slate-100 shadow-xl rounded-[24px] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
          <h2 className="text-sm font-black text-brand-900 uppercase tracking-wider">
            Sales History Index
          </h2>
          <span className="bg-brand-50 text-brand-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            {fetchLoading
              ? "Syncing..."
              : `${salesHistory.length} Settled Logs`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Customer Client</th>
                <th className="p-4">Item Product</th>
                <th className="p-4 text-center">Qty</th>
                <th className="p-4 text-right pr-6">Settled Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
              {salesHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-12 text-center text-slate-400 font-medium text-sm"
                  >
                    No recorded customer sales logs inside this global data
                    channel.
                  </td>
                </tr>
              ) : (
                salesHistory.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 pl-6 text-slate-500 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-300" />
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "Historical"}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-brand-900">
                      {item?.customer?.name}
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {item?.product?.name || item?.product?.title}
                    </td>
                    <td className="p-4 text-center font-bold text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-right pr-6 font-black text-emerald-600">
                      ৳{Number(item.totalPrice).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* {fetchLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Sync Data...
          </p>
        </div>
      )} */}

      {/* ================= INLINE ENTRY MODAL LAYER ================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-brand-900/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden relative max-h-[95vh] overflow-y-auto">
            <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-base font-black text-brand-900 tracking-tight">
                  Record Customer Sale
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Commit outgoing customer logistics entries
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormState);
                  setIsOpen(false);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Target Customer
                  </label>
                  <div className="relative">
                    <UserCheck
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <select
                      required
                      value={formData.customer}
                      className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all cursor-pointer appearance-none"
                      onChange={(e) =>
                        setFormData({ ...formData, customer: e.target.value })
                      }
                    >
                      <option value="">-- Select Customer Client --</option>
                      {customers.map((cust) => (
                        <option key={cust._id} value={cust._id}>
                          {cust.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Target Product
                  </label>
                  <div className="relative">
                    <Layers
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <select
                      required
                      value={formData.product}
                      className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all cursor-pointer appearance-none"
                      onChange={(e) =>
                        setFormData({ ...formData, product: e.target.value })
                      }
                    >
                      <option value="">-- Select Inventory Item --</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name || p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Quantity (Units)
                  </label>
                  <div className="relative">
                    <Hash
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      required
                      type="number"
                      min="1"
                      value={formData.quantity}
                      placeholder="e.g. 20"
                      className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Unit Selling Price (৳)
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.unitPrice}
                      placeholder="e.g. 95000"
                      className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                      onChange={(e) =>
                        setFormData({ ...formData, unitPrice: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    VAT Input (৳)
                  </label>
                  <div className="relative">
                    <Percent
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      type="number"
                      min="0"
                      value={formData.vat}
                      placeholder="0"
                      className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                      onChange={(e) =>
                        setFormData({ ...formData, vat: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Campaign Discount (৳)
                  </label>
                  <div className="relative">
                    <Percent
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      type="number"
                      min="0"
                      value={formData.discount}
                      placeholder="0"
                      className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                      onChange={(e) =>
                        setFormData({ ...formData, discount: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Delivery Shipping (৳)
                  </label>
                  <div className="relative">
                    <Truck
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      type="number"
                      min="0"
                      value={formData.shippingCost}
                      placeholder="e.g. 500"
                      className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingCost: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Total Invoice Aggregation Summary */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between border border-slate-800 shadow-inner mt-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/10 rounded-xl text-brand-400">
                    <Calculator size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Calculated Outbound Value
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                      Real-time dynamic formulation matrix
                    </p>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-400">
                  ৳{computedTotalPrice.toLocaleString()}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialFormState);
                    setIsOpen(false);
                  }}
                  className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Discard Form
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-1 h-11 bg-brand-900 rounded-xl text-[11px] font-black uppercase tracking-widest text-white hover:bg-brand-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-brand-900/10"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Save size={14} /> Commit Entry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
