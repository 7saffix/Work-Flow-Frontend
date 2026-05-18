/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Wallet,
  Package,
  Activity,
  Box,
  AlertTriangle,
} from "lucide-react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import api from "../redux/instance";

// --- CUSTOM TOOLTIP FOR PREMIUM LOOK ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          {payload[0].payload._id}
        </p>
        <p className="text-sm font-black text-brand-900">
          ৳{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/report/dashboard");
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-[60vh]">
  //       <div className="flex flex-col items-center gap-3">
  //         <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin"></div>
  //         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
  //           Initializing Data...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  const summary = data?.summary || {};
  const salesChart = data?.charts?.salesChart || [];
  const bestSellingProducts = data?.tables?.bestSellingProducts || [];

  const kpiCards = [
    {
      label: "Total Sales",
      value: summary.totalSales || 0,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Inventory Value",
      value: summary.totalInventoryValue || 0,
      icon: Box,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Purchases",
      value: summary.totalPurchases || 0,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Expenses",
      value: summary.totalExpenses || 0,
      icon: Wallet,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. KPI Cards */}
      <div className=" grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card, i) => (
          <div
            key={i}
            className={`${card.bg} p-6 rounded-[24px] border border-white shadow-sm transition-all hover:translate-y-[-4px]`}
          >
            <div className="p-2 w-fit bg-white rounded-xl shadow-sm mb-4">
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              {card.label}
            </p>
            <h3
              className={` text-xl 2xl:text-2xl font-black ${card.color} mt-1`}
            >
              ৳{card.value.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Top Performing Products */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-border-thin p-8 shadow-sm">
          <h2 className="text-lg font-bold text-brand-900 flex items-center gap-2 mb-8">
            <Package size={20} className="text-brand-500" /> Top Performing
            Products
          </h2>
          <div className="space-y-6">
            {bestSellingProducts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100 group-hover:border-brand-200 group-hover:text-brand-500 transition-colors">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-900">
                      {item.productName}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Sold: {item.quantitySold} units
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-brand-600">
                    ৳{item.revenue.toLocaleString()}
                  </p>
                  <div className="w-24 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(item.revenue / (summary.totalSales || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Right Panel: Stock Alerts & Trend */}
        <div className="space-y-8">
          {/* Stock Info */}
          <div className="bg-brand-900 rounded-[32px] p-8 text-white relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <AlertTriangle size={20} className="text-brand-500" /> Stock
              Metrics
            </h2>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  Active SKU
                </p>
                <h4 className="text-3xl font-black mt-1">
                  {summary?.totalProducts}
                </h4>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  Avg Order
                </p>
                <h4 className="text-2xl font-black mt-1">
                  ৳{summary?.avgOrderValue?.toLocaleString()}
                </h4>
              </div>
            </div>
          </div>

          {/* Mini Sales Chart */}
          <div className="bg-white rounded-[32px] border border-border-thin p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} className="text-blue-500" /> Growth Trend
            </h2>
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {salesChart.length > 0 ? (
                  <AreaChart data={salesChart}>
                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-300 text-xs font-bold italic">
                    NO_TREND_DATA
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
