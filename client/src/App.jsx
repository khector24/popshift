import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Rankings from "./pages/Rankings";
import StateDetail from "./pages/StateDetail";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main className="app__main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/states/:slug" element={<StateDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
