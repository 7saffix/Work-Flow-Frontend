import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Phone, MapPin, Mail, Save, Plus, X } from "lucide-react";
import api from "../redux/instance";
import { setCustomersData } from "../redux/productSlice"; // adjust import path
import Loader from "../component/Loader";

export default function Customers() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.products?.customers) || [];

  // UI states
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const initialFormState = {
    name: "",
    address: "",
    phone: "",
    email: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // Lazy load dataset on mount
  useEffect(() => {
    if (customers.length > 0) return;

    const fetchCustomers = async () => {
      setFetchLoading(true);
      try {
        const res = await api.get("/customer");
        dispatch(setCustomersData(res.data?.data || res.data || []));
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchCustomers();
  }, [customers.length, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/customer/create", formData);
      if (res.data?.success || res.status === 201 || res.status === 200) {
        setFormData(initialFormState);
        setIsOpen(false);
        // Refresh directory instantly
        const updatedList = await api.get("/customer");
        dispatch(setCustomersData(updatedList.data?.data));
      }
    } catch (err) {
      console.error("Customer addition failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-900 tracking-tight">
            Consumer Hub
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Manage wholesale & retail buyers
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="h-11 px-5 bg-brand-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10 cursor-pointer self-start sm:self-center"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Main Client Registry Table Card */}
      <div className="bg-white border border-slate-100 shadow-xl rounded-[24px] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-sm font-black text-brand-900 uppercase tracking-wider">
            Client Registry
          </h2>
          <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-full">
            {customers.length} Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          {fetchLoading ? (
            <div className="absolute inset-0  z-20 flex items-center justify-center ">
              <Loader />
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium text-sm">
              No registered client listings found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-4 pl-6">Client Info</th>
                  <th className="p-4">Contact Details</th>
                  <th className="p-4">Shipping Location</th>
                  <th className="p-4 pr-6 text-center">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
                {customers.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 pl-6 font-bold text-brand-900">
                      {item.name}
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      <div>{item.phone}</div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        {item.email}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium max-w-[140px] truncate">
                      {item.address}
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase ${item.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ================= INLINE MODAL WINDOW MARKUP ================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-brand-900/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden relative">
            {/* Modal Header */}
            <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-base font-black text-brand-900 tracking-tight">
                  New Customer Profile
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Add retail/consumer buyer
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormState);
                  setIsOpen(false);
                }}
                className="p-1.5 hover:bg-white rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Customer Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    placeholder="e.g. Abdu Rakib"
                    className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    required
                    type="text"
                    value={formData.phone}
                    placeholder="e.g. 012343543543"
                    className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    placeholder="e.g. customerabdu@gmail.com"
                    className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Shipping Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3.5 top-3.5 text-slate-300"
                    size={16}
                  />
                  <textarea
                    required
                    rows="2"
                    value={formData.address}
                    placeholder="e.g. California"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:border-brand-500 outline-none font-medium text-brand-900 transition-all resize-none"
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
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
                  Discard
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
                      <Save size={14} /> Save Profile
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
