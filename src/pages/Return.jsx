import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Hash, ShoppingBag, Save, Plus, X, Calendar } from "lucide-react";
import api from "../redux/instance";
import { setReturnsData } from "../redux/productSlice";
import { toast } from "sonner";

export default function Return() {
  const dispatch = useDispatch();

  const returnHistory = useSelector((state) => state.products?.returns) || [];

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [salesRecords, setSalesRecords] = useState([]);

  const initialFormState = {
    sell: "",
    quantity: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    let isMounted = true;

    const loadLedgerRecords = async () => {
      if (isMounted) setFetchLoading(true);
      try {
        const resHistory = await api.get("/return");
        dispatch(setReturnsData(resHistory.data?.data || []));

        const resSales = await api.get("/sell");
        if (isMounted) {
          setSalesRecords(resSales.data?.data || []);
        }
      } catch (err) {
        console.error("Critical: Return matrix ledger syncing failure:", err);
      } finally {
        if (isMounted) setFetchLoading(false);
      }
    };

    loadLedgerRecords();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      sell: formData.sell,
      quantity: Number(formData.quantity),
    };

    try {
      const res = await api.post("/return/create", payload);

      if (res.data?.success || res.status === 201 || res.status === 200) {
        setFormData(initialFormState);
        setIsOpen(false);
        toast.success(res?.data?.message);
        const refreshHistory = await api.get("/return");
        dispatch(setReturnsData(refreshHistory.data?.data || []));
      }
    } catch (err) {
      console.error(
        "Return ledger entry authorization exception thrown:",
        err.response,
      );
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Find selected sale info to show validation warning limits if necessary
  const selectedSaleDetails = salesRecords.find((s) => s._id === formData.sell);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-900 tracking-tight">
            Inbound Returns Matrix
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Manage customer credit notes and returned balances
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="h-11 px-5 bg-brand-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10 cursor-pointer self-start sm:self-center"
        >
          <Plus size={16} /> Record Return
        </button>
      </div>

      {/* Main Table Layer */}
      <div className="bg-white border border-slate-100 shadow-xl rounded-[24px] overflow-hidden min-h-[300px]">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
          <h2 className="text-sm font-black text-brand-900 uppercase tracking-wider">
            Returns History Index
          </h2>
          <span className="bg-brand-50 text-brand-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            {fetchLoading
              ? "Syncing..."
              : `${returnHistory.length} Credited Logs`}
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
                <th className="p-4 text-center">Unit Price</th>
                <th className="p-4 text-right pr-6">Credited Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
              {returnHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center text-slate-400 font-medium text-sm"
                  >
                    No recorded item returns inside this data channel.
                  </td>
                </tr>
              ) : (
                returnHistory.map((item) => (
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
                      {item?.sell?.customer?.name || "Unknown Customer"}
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {item?.sell?.product?.name ||
                        item?.product?.title ||
                        "Unknown Item"}
                    </td>
                    <td className="p-4 text-center font-bold text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-center font-bold text-slate-700">
                      {item.unitPrice}
                    </td>
                    <td className="p-4 text-right pr-6 font-black text-blue-600">
                      ৳{Number(item.totalPrice || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Return Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-brand-900/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden relative max-h-[95vh] overflow-y-auto">
            <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-base font-black text-brand-900 tracking-tight">
                  Record Product Return
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Process item returns directly linked to an invoice entry
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
              {/* Dropdown: Reference Invoice (Sell ID) */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Select Sales Invoice
                </label>
                <div className="relative">
                  <ShoppingBag
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <select
                    required
                    value={formData.sell}
                    className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all cursor-pointer appearance-none"
                    onChange={(e) =>
                      setFormData({ ...formData, sell: e.target.value })
                    }
                  >
                    <option value="">-- Choose Sales Entry --</option>
                    {salesRecords.map((sale) => (
                      <option key={sale._id} value={sale._id}>
                        {sale.customer?.name} -{" "}
                        {sale.product?.name || sale.product?.title} (Qty Sold:{" "}
                        {sale.quantity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input: Return Quantity */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Quantity to Return
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
                    max={
                      selectedSaleDetails
                        ? selectedSaleDetails.quantity
                        : undefined
                    }
                    value={formData.quantity}
                    placeholder={
                      selectedSaleDetails
                        ? `Max allowed: ${selectedSaleDetails.quantity}`
                        : "e.g. 2"
                    }
                    className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>
                {selectedSaleDetails && (
                  <p className="text-[10px] text-slate-400 font-bold ml-1 mt-1">
                    Original Price: ৳
                    {Number(selectedSaleDetails.unitPrice).toLocaleString()} per
                    unit
                  </p>
                )}
              </div>

              {/* Action Buttons */}
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
