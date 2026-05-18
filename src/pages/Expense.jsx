import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Layers,
  FileText,
  DollarSign,
  Save,
  Plus,
  X,
  Calendar,
} from "lucide-react";
import api from "../redux/instance";
import { setExpensesData, setExpenseTypesData } from "../redux/productSlice"; // Reusing your uniform product slice architecture

export default function Expense() {
  const dispatch = useDispatch();

  const expenseHistory = useSelector((state) => state.products?.expenses) || [];
  const expenseTypes =
    useSelector((state) => state.products?.expenseTypes) || [];

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const initialFormState = {
    expenseType: "",
    name: "",
    amount: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    let isMounted = true;

    const loadExpenseLedger = async () => {
      if (isMounted) setFetchLoading(true);
      try {
        const resHistory = await api.get("/expense");
        dispatch(setExpensesData(resHistory.data?.data || []));

        if (expenseTypes.length === 0) {
          const resTypes = await api.get("/expense/expenseType");
          if (isMounted) {
            dispatch(setExpenseTypesData(resTypes.data?.data || []));
          }
        }
      } catch (err) {
        console.error("Critical: Expense matrix syncing system failure:", err);
      } finally {
        if (isMounted) setFetchLoading(false);
      }
    };

    loadExpenseLedger();

    return () => {
      isMounted = false;
    };
  }, [dispatch, expenseTypes.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      expenseType: formData.expenseType,
      name: formData.name.trim(),
      amount: Number(formData.amount),
    };

    try {
      const res = await api.post("/expense/create", payload);
      if (res.data?.success || res.status === 201 || res.status === 200) {
        setFormData(initialFormState);
        setIsOpen(false);

        const refreshHistory = await api.get("/expense");
        dispatch(setExpensesData(refreshHistory.data?.data || []));
      }
    } catch (err) {
      console.error(
        "Expense ledger allocation exception thrown:",
        err.response,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Content View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-900 tracking-tight">
            Operating Expenses Ledger
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Track business overheads, utility bills, and variable expenditures
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="h-11 px-5 bg-brand-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10 cursor-pointer self-start sm:self-center"
        >
          <Plus size={16} /> Record Expense
        </button>
      </div>

      {/* Main Global Presentation Table Layer */}
      <div className="bg-white border border-slate-100 shadow-xl rounded-[24px] overflow-hidden min-h-[300px]">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
          <h2 className="text-sm font-black text-brand-900 uppercase tracking-wider">
            Expenses Log Index
          </h2>
          <span className="bg-brand-50 text-brand-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            {fetchLoading
              ? "Syncing..."
              : `${expenseHistory.length} Documented Logs`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Expense Title</th>
                <th className="p-4">Category Type</th>
                <th className="p-4 text-right pr-6">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
              {expenseHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-12 text-center text-slate-400 font-medium text-sm"
                  >
                    No recorded overhead expenditures found inside this database
                    channel.
                  </td>
                </tr>
              ) : (
                expenseHistory.map((item) => (
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
                      {item.name}
                    </td>
                    <td className="p-4 font-medium text-slate-500">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {item.expenseType?.name || "General Overhead"}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 font-black text-rose-600">
                      ৳{Number(item.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Input Slide Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-brand-900/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden relative max-h-[95vh] overflow-y-auto">
            <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-base font-black text-brand-900 tracking-tight">
                  Record Overhead Expense
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Allocate debit entries against specific operational costs
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
              {/* Category Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Expense Category Type
                </label>
                <div className="relative">
                  <Layers
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <select
                    required
                    value={formData.expenseType}
                    className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all cursor-pointer appearance-none"
                    onChange={(e) =>
                      setFormData({ ...formData, expenseType: e.target.value })
                    }
                  >
                    <option value="">-- Choose Category --</option>
                    {expenseTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expense Custom Label */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Expense Title / Description
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    placeholder="e.g. Electricity bill"
                    className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Amount Injected */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Amount Settled (৳)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.amount}
                    placeholder="e.g. 4452"
                    className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Control System Triggers */}
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
