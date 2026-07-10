import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";

// TBD if I want to merge it with home page.
// import Dashboard from "./pages/Dashboard";

import States from "./pages/States";
import StateDetail from "./pages/StateDetail";

// Later implementtion
// import Compare from "./pages/Compare";

import About from "./pages/About";
import Methodology from "./pages/Methodology";
import DataSources from "./pages/DataSources";
import MetroDirectory from "./pages/MetroDirectory";
import MetroDetail from "./pages/MetroDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main className="app__main">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/states" element={<States />} />
            <Route path="/states/:code" element={<StateDetail />} />
            {/* <Route path="/compare" element={<Compare />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/metros/" element={<MetroDirectory />} />
            <Route path="/metros/:slug" element={<MetroDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
