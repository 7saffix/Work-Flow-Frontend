import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    brands: [],
    categories: [],
    suppliers: [],
    customers: [],
    purchases: [],
    stats: null,
    totalPages: 1,
    loading: false,
  },
  reducers: {
    // --- Fetch Reducers ---
    setProductsData: (state, action) => {
      state.items = action.payload.products;
      state.stats = action.payload.stats;
      state.totalPages = action.payload.totalPages;
      state.loading = false;
    },
    setBrandsData: (state, action) => {
      state.brands = action.payload;
      state.loading = false;
    },
    setCategoriesData: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    },
    setSuppliersData: (state, action) => {
      state.suppliers = action.payload;
    },
    setCustomersData: (state, action) => {
      state.customers = action.payload;
    },
    setPurchasesData: (state, action) => {
      state.purchases = action.payload;
    },
    setProductLoading: (state, action) => {
      state.loading = action.payload;
    },

    // --- Add / Push Reducers ---

    // Pushes a new product to the front of the list so it shows at the top of your table
    addProduct: (state, action) => {
      state.items.unshift(action.payload); // unshift puts it at index 0, .push() puts it at the end
    },

    // Pushes a new brand into the brands array
    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },

    // Pushes a new category into the categories array
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
  },
});

export const {
  setProductsData,
  setBrandsData,
  setCategoriesData,
  setCustomersData,
  setSuppliersData,
  setPurchasesData,
  setProductLoading,
  addProduct,
  addBrand,
  addCategory,
} = productSlice.actions;

export default productSlice.reducer;
