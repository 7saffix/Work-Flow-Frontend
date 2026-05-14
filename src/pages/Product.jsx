import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Box,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../redux/instance";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // State for Pagination, Search, and Sort
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    sort: "sellingPrice",
    order: "asc",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Constructing the query string
        const { page, limit, search, sort, order } = filters;
        const queryString = `?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

        const res = await api.get(`/product${queryString}`);
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Product fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]); // Re-run whenever a filter changes

  // Handler for search (with a small delay/debounce if needed)
  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-900 tracking-tight">
            Product Inventory
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            Showing {products.length} Results
          </p>
        </div>
        <button className="flex items-center gap-2 bg-brand-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-[24px] border border-border-thin flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Search SKU or Product Name..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 outline-none font-medium text-brand-900"
          />
        </div>
        <select
          onChange={(e) => {
            const [sort, order] = e.target.value.split("-");
            setFilters((prev) => ({ ...prev, sort, order, page: 1 }));
          }}
          className="bg-slate-50 text-slate-600 px-5 py-3 rounded-xl text-sm font-bold border border-slate-100 outline-none cursor-pointer"
        >
          <option value="sellingPrice-asc">Price: Low to High</option>
          <option value="sellingPrice-desc">Price: High to Low</option>
          {/* <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option> */}
        </select>
      </div>

      {/* Product Table - RESPONSIVE WRAPPER ADDED HERE */}
      <div className="bg-white rounded-[32px] border border-border-thin overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {" "}
          {/* This makes the table scroll on mobile */}
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Product Details
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Category
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Purchase Price
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Selling Price
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Stock Status
                </th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand-900 border border-slate-200">
                        <Box size={20} />
                      </div>
                      <p className="text-sm font-black text-brand-900">
                        {item.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {item.category || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap font-black text-brand-900 text-sm">
                    ৳{item.purchasePrice?.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap font-black text-brand-900 text-sm">
                    ৳{item.sellingPrice?.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {item.stock > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-600 uppercase">
                          In Stock
                        </span>
                        <p className="text-xs font-bold text-slate-400">
                          {item.stock} units
                        </p>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-red-500 uppercase bg-red-50 px-2 py-1 rounded-md">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Page {filters.page} of {totalPages || 1}
            </p>

            {/* Page Numbers: Only show if there is more than 1 page */}
            {totalPages > 1 && (
              <div className="flex gap-1 ml-4">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: index + 1 }))
                    }
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${
                      filters.page === index + 1
                        ? "bg-brand-900 text-white border-brand-900 shadow-md shadow-brand-900/20"
                        : "bg-white text-slate-400 border-slate-200 hover:border-brand-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-brand-900 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              disabled={filters.page >= totalPages}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-brand-900 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex pt-20 justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                Sync Data...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
