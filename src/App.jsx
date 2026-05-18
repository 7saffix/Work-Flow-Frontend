import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useGetProfile } from "./hooks/useGetProfile";
import { useSelector } from "react-redux";
import Loader from "./component/Loader";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import Products from "./pages/Product";
import Brands from "./pages/Brand";
import Categories from "./pages/Category";
import Suppliers from "./pages/Supplier";
import Customers from "./pages/Customer";
import Purchase from "./pages/Purchase";
import Sell from "./pages/Sell";
import Return from "./pages/Return";
import Expense from "./pages/Expense";
import Report from "./pages/Report";

function App() {
  const isInitializing = useGetProfile();

  const { user } = useSelector((state) => state.user);

  if (isInitializing) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected Area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<Products />} />
          <Route path="/brand" element={<Brands />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/supplier" element={<Suppliers />} />
          <Route path="/customer" element={<Customers />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/return" element={<Return />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/report" element={<Report />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
