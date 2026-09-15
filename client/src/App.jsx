import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import ScrollToTop from "./router/ScrollToTop";
import ProtectedRoute from "./router/ProtectedRoute";

import Home from "./pages/Home";

// TBD if I want to merge it with home page.
import Dashboard from "./pages/Dashboard";

import States from "./pages/States";
import StateDetail from "./pages/StateDetail";

// Later implementtion
// import Compare from "./pages/Compare";

import About from "./pages/About";
import Methodology from "./pages/Methodology";
import DataSources from "./pages/DataSources";
import MetroDirectory from "./pages/MetroDirectory";
import MetroDetail from "./pages/MetroDetail";
import CityDirectory from "./pages/CityDirectory";
import CityDetail from "./pages/CityDetail";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminArticleForm from "./pages/admin/AdminArticleForm";

// Frontend 404 page
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      <div className="app">
        {!isAdminRoute && <Navbar />}

        <main className="app__main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/states" element={<States />} />
            <Route path="/states/:code" element={<StateDetail />} />
            {/* <Route path="/compare" element={<Compare />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/metros/" element={<MetroDirectory />} />
            <Route path="/metros/:slug" element={<MetroDetail />} />
            <Route path="/cities" element={<CityDirectory />} />
            <Route path="/cities/:slug" element={<CityDetail />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route
                path="/admin/articles/new"
                element={<AdminArticleForm />}
              />
              <Route
                path="/admin/articles/:id/edit"
                element={<AdminArticleForm />}
              />
            </Route>

            {/* Return a custom page when no frontend route matches */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
