import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  Edit3,
  Box,
  ChevronLeft,
  ChevronRight,
  Package2,
  PackageX,
  AlertTriangle,
  Wallet,
} from "lucide-react";

import api from "../redux/instance";
import ProductModal from "../component/ProductModal";
import { setProductsData, setProductLoading } from "../redux/productSlice";

export default function Products() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = useSelector((state) => state.products?.items) || [];
  const stats = useSelector((state) => state.products?.stats) || null;
  const totalPages = useSelector((state) => state.products?.totalPages) || 1;
  const loading = useSelector((state) => state.products?.loading) || false;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    search: "",
    sort: "sellingPrice",
    order: "asc",
  });

  const fetchProducts = async (currentFilters) => {
    const { page, limit, search, sort, order } = currentFilters;
    const queryString = `?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

    dispatch(setProductLoading(true));
    try {
      const [productRes, inventoryRes] = await Promise.all([
        api.get(`/product${queryString}`),
        api.get("/report/inventory"),
      ]);

      const productPayload = productRes.data?.data?.result;
      const totalPagesPayload = productRes?.data?.data?.meta?.totalPages || 1;
      const statsPayload = inventoryRes.data?.data || null;

      dispatch(
        setProductsData({
          products: productPayload,
          stats: statsPayload,
          totalPages: totalPagesPayload,
        }),
      );
    } catch (err) {
      console.error("Failed syncing inventory products collection:", err);
    } finally {
      dispatch(setProductLoading(false));
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const handleSearch = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const cards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package2,
      color: "bg-brand-100",
      text: "text-brand-600",
    },
    {
      title: "Inventory Value",
      value: `৳${(stats?.totalInventoryValue || 0).toLocaleString()}`,
      icon: Wallet,
      color: "bg-emerald-100",
      text: "text-emerald-600",
    },
    {
      title: "Low Stock",
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: "bg-amber-100",
      text: "text-amber-600",
    },
    {
      title: "Out of Stock",
      value: stats?.outOfStockCount || 0,
      icon: PackageX,
      color: "bg-red-100",
      text: "text-red-600",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row lg:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--color-brand-900)]">
            Product Inventory
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage products, stock and pricing efficiently
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-3 rounded-2xl bg-[var(--color-brand-900)] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-1 hover:bg-[var(--color-brand-500)]"
        >
          <Plus
            size={18}
            className="transition-transform group-hover:rotate-90"
          />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`relative overflow-hidden rounded-[24px] ${card.color} p-6 ${card.text} shadow-sm`}
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className={`text-sm font-medium ${card.text}`}>
                    {card.title}
                  </p>
                  <h2 className="mt-4 text-xl font-black tracking-tight">
                    {card.value}
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white backdrop-blur-sm">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="rounded-[30px] border border-[var(--color-border-thin)] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              onChange={handleSearch}
              placeholder="Search products..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-[var(--color-brand-900)] outline-none transition-all focus:border-[var(--color-brand-500)] focus:bg-white"
            />
          </div>

          <select
            onChange={(e) => {
              const [sort, order] = e.target.value.split("-");
              setFilters((prev) => ({
                ...prev,
                sort,
                order,
                page: 1,
              }));
            }}
            className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-600 outline-none cursor-pointer"
          >
            <option value="sellingPrice-asc">Price: Low to High</option>
            <option value="sellingPrice-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Table Container layout */}
      <div className="bg-white rounded-[32px] border border-border-thin overflow-hidden shadow-sm relative min-h-[250px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Product
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Category
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Purchase
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Selling
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Stock
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {!loading && products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm font-semibold text-slate-400"
                  >
                    No products found matching your active criteria metrics.
                  </td>
                </tr>
              ) : (
                products?.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-brand-900 border border-slate-200">
                          <Box size={20} />
                        </div>
                        <p className="text-sm font-black text-brand-900">
                          {item.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                        {item.category?.name ||
                          item.category?.categoryName ||
                          (typeof item.category === "string"
                            ? item.category
                            : "General")}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-black text-brand-900 text-sm">
                      ৳{item.purchasePrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-black text-brand-900 text-sm">
                      ৳{item.sellingPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {item.stock > 5 ? (
                        <div>
                          <p className="text-[10px] font-black uppercase text-emerald-600">
                            In Stock
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {item.stock} Units
                          </p>
                        </div>
                      ) : item.stock > 0 ? (
                        <div>
                          <p className="text-[10px] font-black uppercase text-amber-500">
                            Low Stock
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {item.stock} Units
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-red-500 uppercase bg-red-50 px-2 py-1 rounded-md">
                          Out of stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {item.isActive ? (
                        <div>
                          <p className="text-[10px] font-black uppercase text-emerald-600">
                            Active
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[10px] font-black uppercase text-amber-500">
                            InActive
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Full Table Absolute Loading Blur Overlay (Keeps UI stable, doesn't bounce layouts) */}
        {/* {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Sync Data...
            </p>
          </div>
        )} */}
        {/* Pagination Section controls */}
        {!loading && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Page {filters.page} of {totalPages || 1}
              </p>
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
                          ? "bg-[var(--color-brand-900)] text-white border-[var(--color-brand-900)] shadow-md"
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
                className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-[var(--color-brand-900)] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={filters.page >= totalPages}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-[var(--color-brand-900)] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Creation Drawer Modal */}
      <ProductModal
        isOpen={isModalOpen}
        key={selectedProduct?._id || "create-new-entry"}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => fetchProducts(filters)}
        productData={selectedProduct}
      />
    </div>
  );
}
