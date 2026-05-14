import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  ShieldCheck,
  ArrowRight,
  PackageSearch,
  Globe,
  Database,
  ArrowUpRight,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_200px,#dbeafe,transparent)]"></div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-slate-100/50 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            W
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            WorkFlow
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100 flex items-center gap-2"
          >
            Go to Dashboard <ArrowUpRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 pt-24 pb-20 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-8">
          <Globe size={14} className="animate-pulse" />
          <span>REAL-TIME INVENTORY TRACKING V1.0</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.95]">
          Manage your warehouse <br />
          <span className="text-blue-600">without the chaos.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed">
          The ultimate control panel for modern commerce. Track products,
          suppliers, and sales with automated stock adjustment and deep
          reporting.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button
            onClick={() => navigate("/login")}
            className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-2 text-lg"
          >
            Start Free
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <p className="text-sm text-slate-400 font-medium italic">
            No credit card required
          </p>
        </div>

        {/* Real Interface Mockup */}
        <div className="relative group max-w-6xl mx-auto">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-400/20 blur-[100px] -z-10 rounded-full"></div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white p-2">
            <img
              src="https://cdn.dribbble.com/userupload/17770588/file/original-ed8d5fbe3b9d939ad16b22a761fccead.png?resize=2048x1536&vertical=center"
              alt="Inventory Dashboard Screenshot"
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </header>

      {/* Core Capabilities Section - Different Lite Background */}
      <section className="bg-slate-50/80 border-y border-slate-100 py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Core Capabilities
              </h2>
              <p className="text-slate-500 max-w-md italic">
                Engineered for businesses that need speed and accuracy.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Automated Stock",
                desc: "Real-time stock increases on purchase and decreases on sale.",
                icon: PackageSearch,
              },
              {
                title: "Financial Logic",
                desc: "Built-in VAT, discount, and complex shipping cost handling.",
                icon: BarChart3,
              },
              {
                title: "Auth Protection",
                desc: "JWT-secured routes keep your business data private.",
                icon: ShieldCheck,
              },
              {
                title: "Return Engine",
                desc: "Seamlessly handle sales and purchase returns with auto-balance.",
                icon: Database,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <item.icon size={28} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-20 text-center bg-white">
        <p className="text-slate-400 text-sm font-medium">
          © 2026 Powered by WorkFlow V1.0 • Created by Safi
        </p>
      </footer>
    </div>
  );
}
