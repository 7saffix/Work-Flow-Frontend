import { useLocation } from "react-router-dom";
import { Menu, LogOut, User, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";

export default function TopBar({ toggleSidebar }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const currentPage = location.pathname.split("/")[1];

  const handleLogout = async () => {};

  return (
    <header className=" bg-surface border-b border-border-thin sticky top-0 z-30 p-4 flex items-center justify-between">
      {/* Left: Menu Trigger & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 lg:hidden text-slate-600 hover:bg-brand-50 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <nav className="flex items-center gap-2">
          <span className="text-slate-400 text-xs xl:text-sm font-bold uppercase tracking-widest hidden sm:block">
            WorkFlow
          </span>
          <ChevronRight size={14} className="text-slate-300 hidden sm:block" />
          <span className="text-brand-900 font-bold text-sm capitalize tracking-tight bg-brand-50 px-3 py-1 rounded-lg">
            {currentPage}
          </span>
        </nav>
      </div>

      {/* Right: Profile & Logout */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-sm font-bold text-brand-900 leading-none">
            <User />
          </span>
          <span className="text-[10px] 2xl:text-[10px] font-bold text-brand-500 uppercase tracking-tighter mt-1">
            {user?.email || "Admin"}
          </span>
        </div>

        <div className="h-10 w-[1px] bg-border-thin mx-2 hidden md:block"></div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-danger hover:bg-red-50 rounded-xl transition-all font-bold text-sm group"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
