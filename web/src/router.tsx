// src/router.tsx
import React from 'react'
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth'
import AppLayout from './layout/AppLayout'
import Home from './screens/Home'
import Login from './screens/Login'
import Signup from './screens/Signup'
import Dashboard from './screens/Dashboard'
import Reserve from './screens/Reserve'
import Menu from './screens/Menu'
import About from './screens/About'
import Gallery from './screens/Gallery'
import Access from './screens/Access'
import Contact from './screens/Contact'
import News from './screens/News'
import Events from './screens/Events'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="p-6">読み込み中...</div>
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <>{children}</>
}

function NotFound() {
  return <div className="p-6">ページが見つかりません（404）</div>;
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <div className="p-6">予期せぬエラーが発生しました。</div>, // 任意（ErrorBoundary的）
    children: [
      { index: true, element: <Home /> },
      { path: '/menu', element: <Menu /> },
      { path: '/about', element: <About /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/access', element: <Access /> },
      { path: '/contact', element: <Contact /> },
      { path: '/news', element: <News /> },
      { path: '/events', element: <Events /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/dashboard', element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: '/reserve', element: <PrivateRoute><Reserve /></PrivateRoute> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);