import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Undo2,
  Users,
  UserSquare2,
  Wallet,
  FileBarChart,
  X,
  Layers,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Product", path: "/product", icon: Package },
  { name: "Purchase", path: "/purchase", icon: ShoppingCart },
  { name: "Sell", path: "/sell", icon: TrendingUp },
  { name: "Return", path: "/return", icon: Undo2 },
  { name: "Brand", path: "/brand", icon: Package },
  { name: "Category", path: "/category", icon: Layers },
  { name: "Supplier", path: "/supplier", icon: Users },
  { name: "Customer", path: "/customer", icon: UserSquare2 },
  { name: "Expense", path: "/expense", icon: Wallet },
  { name: "Report", path: "/report", icon: FileBarChart },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-surface/80 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen bg-surface border-r border-border-thin
        transition-transform duration-300 w-64 2xl:w-80 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
              W
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-900">
              WorkFlow
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Menu */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all
                ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
