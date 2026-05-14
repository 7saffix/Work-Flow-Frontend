import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useGetProfile } from "./hooks/useGetProfile";
import { useSelector } from "react-redux";
import Loader from "./component/Loader";

function App() {
  const isInitializing = useGetProfile();

  const { user } = useSelector((state) => state.user);

  if (isInitializing) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Area */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

{
  /* Protected App Area */
}
// <Route element={<AuthGuard />}>
//   <Route
//     element={
//       <MainLayout>
//         <Outlet />
//       </MainLayout>
//     }
//   >
//     <Route path="/dashboard" element={<Dashboard />} />
//     <Route path="/products" element={<Products />} />
//     {/* ... */}
//   </Route>
// </Route>

{
  /* <BrowserRouter>
  <Routes>
    {/* Public Route */
}
// <Route path="/login" element={<Login />} />

{
  /* Protected Routes */
}
// <Route element={<AuthGuard />}>
// <Route element={<MainLayout><Outlet /></MainLayout>}>
// <Route path="/" element={<Dashboard />} />
// <Route path="/products" element={<Products />} />
{
  /* ...other pages */
}
// </Route>
// </Route>
// </Routes>
// </BrowserRouter> */}

// import { Navigate, Outlet } from 'react-router-dom';

// export default function AuthGuard() {
//   // Logic: Check if user is authenticated (e.g., via a context or checking for user in state)
//   // Since you use Cookies, usually your app does a "me" request on boot.
//   const isAuthenticated = true; // Replace with your actual auth logic

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// }
