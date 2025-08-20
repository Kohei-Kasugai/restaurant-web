// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./screens/Home"
import Login from "./screens/Login"
import Signup from "./screens/Signup"
import Dashboard from "./screens/Dashboard"

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {/* ナビゲーション */}
        <Navbar />

        {/* メインコンテンツ */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        {/* フッター */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}
