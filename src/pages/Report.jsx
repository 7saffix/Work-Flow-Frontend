/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  BarChart3,
  Package,
  TrendingDown,
  Users,
  Truck,
  RefreshCcw,
  AlertTriangle,
  Layers,
  Calendar,
} from "lucide-react";
import api from "../redux/instance";

export default function Report() {
  const [activeTab, setActiveTab] = useState("sales");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState("");

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [custRes, suppRes] = await Promise.all([
          api.get("/customer"),
          api.get("/supplier"),
        ]);
        const custData = custRes.data?.data || [];
        const suppData = suppRes.data?.data || [];
        setCustomers(custData);
        setSuppliers(suppData);

        if (custData.length > 0) setSelectedCustomerId(custData[0]._id);
        if (suppData.length > 0) setSelectedSupplierId(suppData[0]._id);
      } catch (err) {
        console.error("Failed loading report selection dependencies:", err);
      }
    };
    loadDependencies();
  }, []);

  const fetchReportData = async () => {
    if (activeTab === "customer" && !selectedCustomerId) return;
    if (activeTab === "supplier" && !selectedSupplierId) return;

    setLoading(true);
    try {
      let endpoint = `/report/${activeTab}`;
      if (activeTab === "customer")
        endpoint += `?customerId=${selectedCustomerId}`;
      if (activeTab === "supplier")
        endpoint += `?supplierId=${selectedSupplierId}`;

      const res = await api.get(endpoint);
      setReportData(res.data?.data || res.data || null);
    } catch (err) {
      console.error(`Error querying /report/${activeTab}:`, err);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [activeTab, selectedCustomerId, selectedSupplierId]);

  const tabsConfig = [
    { id: "sales", label: "Sales Report", icon: ShoppingBag },
    { id: "purchase", label: "Purchase Report", icon: BarChart3 },
    { id: "inventory", label: "Inventory Stats", icon: Package },
    { id: "expense", label: "Expense Audit", icon: TrendingDown },
    { id: "customer", label: "Customer Activity", icon: Users },
    { id: "supplier", label: "Supplier Volume", icon: Truck },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-900 tracking-tight">
            Central Analytics Engine
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Real-time aggregates calculated directly from database records
          </p>
        </div>
        <button
          onClick={fetchReportData}
          className="h-11 px-4 border border-slate-200 hover:border-slate-300 bg-white text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-center"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />{" "}
          Recalculate
        </button>
      </div>

      {/* Simplified Native Tab Swiper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 select-none">
        {tabsConfig.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-900 text-white shadow-md"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100/80 border border-slate-100"
              }`}
            >
              <IconComponent size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Target Sub-Selectors for Aggregation Parameters */}
      {(activeTab === "customer" || activeTab === "supplier") && (
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl max-w-sm animate-in fade-in duration-200">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
            Select Focus Entity Target
          </label>
          {activeTab === "customer" ? (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="h-10 w-full px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-brand-900 outline-none"
            >
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="h-10 w-full px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-brand-900 outline-none"
            >
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {(!loading && !reportData) ||
      (Array.isArray(reportData) && reportData.length === 0) ? (
        <div className="h-[200px] flex items-center justify-center bg-white border border-slate-100 rounded-[24px] text-slate-400 text-xs font-medium tracking-wide">
          No records captured in the database matching this query.
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* ==========================================
              TAB SUB-VIEW CARD LAYOUT GENERATORS
             ========================================== */}

          {/* 1. SALES TAB OUTPUT */}
          {activeTab === "sales" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="Gross Sales Volume"
                value={`৳${Number(reportData?.totalSales || 0).toLocaleString()}`}
                icon={ShoppingBag}
                color="text-blue-600"
              />
              <SummaryCard
                title="Total Quantity Sold"
                value={`${reportData?.totalQuantity || 0} Units`}
                icon={Package}
                color="text-slate-700"
              />
              <SummaryCard
                title="Discounts Handed Out"
                value={`৳${Number(reportData?.totalDiscount || 0).toLocaleString()}`}
                icon={TrendingDown}
                color="text-rose-500"
              />
              <SummaryCard
                title="Invoices Processed"
                value={`${reportData?.totalOrders || 0} Invoices`}
                icon={Layers}
                color="text-brand-900"
              />
            </div>
          )}

          {/* 2. PURCHASE TAB OUTPUT */}
          {activeTab === "purchase" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard
                title="Total Asset Procurement Cost"
                value={`৳${Number(reportData.totalAmount || 0).toLocaleString()}`}
                icon={BarChart3}
                color="text-indigo-600"
              />
              <SummaryCard
                title="Total Quantity Procured"
                value={`${reportData.totalQuantity || 0} Units`}
                icon={Package}
                color="text-slate-600"
              />
              <SummaryCard
                title="Procurement Invoices"
                value={`${reportData.totalPurchases || 0} Logs`}
                icon={Layers}
                color="text-brand-900"
              />
            </div>
          )}

          {/* 3. INVENTORY TAB OUTPUT */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <SummaryCard
                  title="Estimated Value"
                  value={`৳${Number(reportData.totalInventoryValue || 0).toLocaleString()}`}
                  icon={BarChart3}
                  color="text-emerald-600"
                />
                <SummaryCard
                  title="Total Unique Items"
                  value={reportData.totalProducts}
                  icon={Package}
                  color="text-blue-600"
                />
                <SummaryCard
                  title="Low Stock Warning"
                  value={reportData.lowStockCount}
                  icon={AlertTriangle}
                  color="text-amber-500"
                  highlight={reportData.lowStockCount > 0}
                />
                <SummaryCard
                  title="Out of Stock Count"
                  value={reportData.outOfStockCount}
                  icon={AlertTriangle}
                  color="text-rose-600"
                  highlight={reportData.outOfStockCount > 0}
                />
              </div>

              {/* Simple inventory warning status block */}
              {(reportData.lowStockCount > 0 ||
                reportData.outOfStockCount > 0) && (
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
                  <h3 className="text-xs font-black text-brand-900 uppercase tracking-wider mb-4 text-amber-600 flex items-center gap-2">
                    <AlertTriangle size={16} /> Urgent Replenishment Warnings
                  </h3>
                  <div className="divide-y divide-slate-50 text-xs">
                    {reportData.products
                      ?.filter((p) => p.stock <= 5)
                      .map((p) => (
                        <div
                          key={p._id}
                          className="py-2.5 flex items-center justify-between font-bold"
                        >
                          <span className="text-slate-700">
                            {p.name || p.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded ${p.stock <= 0 ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}
                          >
                            {p.stock <= 0
                              ? "Out of Stock"
                              : `${p.stock} Units Left`}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. EXPENSE TAB OUTPUT */}
          {activeTab === "expense" && (
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-xs font-black text-brand-900 uppercase tracking-wider">
                  Overhead Category Expenditure
                </h3>
              </div>
              <div className="divide-y divide-slate-50 text-xs sm:text-sm">
                {/* Array.isArray ensures the code handles the array safely without crashing */}
                {Array.isArray(reportData) ? (
                  reportData.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center justify-between font-medium"
                    >
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] bg-slate-100 px-2 py-1 rounded">
                        Category Ref: {item.expenseTypeName || "General"}
                      </span>
                      <span className="font-black text-rose-600">
                        ৳{Number(item.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 italic">
                    Invalid expense data structure received.
                  </div>
                )}
              </div>
            </div>
          )}
          {/* 5. CUSTOMER TAB OUTPUT */}
          {activeTab === "customer" && reportData[0] && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard
                  title="Customer Account"
                  value={reportData[0].customerName}
                  icon={Users}
                  color="text-brand-900"
                />
                <SummaryCard
                  title="Total Cash Contributed"
                  value={`৳${Number(reportData[0].totalAmount || 0).toLocaleString()}`}
                  icon={ShoppingBag}
                  color="text-blue-600"
                />
                <SummaryCard
                  title="Total Units Purchased"
                  value={`${reportData[0].totalQuantity || 0} Units`}
                  icon={Package}
                  color="text-slate-600"
                />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-400">
                <span>LAST TRANSACTION GENERATED</span>
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Calendar size={14} />{" "}
                  {new Date(reportData[0].lastPurchase).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* 6. SUPPLIER TAB OUTPUT */}
          {activeTab === "supplier" && reportData[0] && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard
                  title="Supplier Account"
                  value={reportData[0].supplierName}
                  icon={Truck}
                  color="text-indigo-600"
                />
                <SummaryCard
                  title="Total Outward Investment"
                  value={`৳${Number(reportData[0].totalCost || 0).toLocaleString()}`}
                  icon={BarChart3}
                  color="text-rose-600"
                />
                <SummaryCard
                  title="Total Supply Transactions"
                  value={`${reportData[0].totalPurchases || 0} Purchase Orders`}
                  icon={Layers}
                  color="text-slate-700"
                />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-400">
                <span>OPERATING LOCATION ADDRESS</span>
                <span className="text-slate-800">
                  {reportData[0].address || "Not Disclosed"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Clean Sub-Component Widget for keeping metric cards uniform
function SummaryCard({ title, value, icon: Icon, color, highlight }) {
  return (
    <div
      className={`bg-white p-5 border shadow-sm rounded-[24px] flex items-center justify-between transition-all ${
        highlight ? "border-amber-200 bg-amber-50/20" : "border-slate-100"
      }`}
    >
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {title}
        </p>
        <h3 className="text-lg font-black text-brand-900 mt-1 tracking-tight">
          {value}
        </h3>
      </div>
      <div className={`p-2.5 bg-slate-50 rounded-xl ${color}`}>
        <Icon size={18} />
      </div>
    </div>
  );
}
