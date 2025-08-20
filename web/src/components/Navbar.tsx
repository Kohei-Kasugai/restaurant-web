// src/components/Navbar.tsx
import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)

  const onLogout = async () => {
    await logout()
    nav('/login')
  }

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'font-semibold underline' : ''}`

  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="font-bold text-lg">Demo Bistro</Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
            <NavLink to="/" className={linkCls}>HOME</NavLink>
            <NavLink to="/menu" className={linkCls}>MENU</NavLink>
            <NavLink to="/about" className={linkCls}>ABOUT</NavLink>
            <NavLink to="/gallery" className={linkCls}>GALLERY</NavLink>
            <NavLink to="/news" className={linkCls}>NEWS</NavLink>
            <NavLink to="/access" className={linkCls}>ACCESS</NavLink>
        </nav>

        {/* モバイルメニュー開閉 */}
        <button
          className="ml-auto md:hidden p-2 border rounded"
          onClick={() => setOpen(v => !v)}
          aria-label="menu"
          aria-expanded={open}
        >
          ☰
        </button>

        {/* 右側（デスクトップ） */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-700">ようこそ、{user.full_name} さん</span>
              <Link to="/dashboard" className="px-3 py-2 rounded border">予約一覧</Link>
              <button onClick={onLogout} className="px-3 py-2 rounded bg-gray-900 text-white">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded border">ログイン</Link>
              <Link to="/signup" className="px-3 py-2 rounded bg-blue-600 text-white">新規登録</Link>
              <Link to="/reserve" className="px-3 py-2 rounded bg-amber-500 text-white">予約</Link>

            </>
          )}
        </div>
      </div>

      {/* モバイルドロップダウン */}
      {open && (
        <div className="md:hidden border-t px-4 py-3 space-y-2">
          <NavLink to="/" className={linkCls} onClick={() => setOpen(false)}>
            ホーム
          </NavLink>
          <a
            className="block px-3 py-2 rounded hover:bg-gray-100"
            href="#features"
            onClick={() => setOpen(false)}
          >
            特徴
          </a>

          <div className="pt-2 border-t mt-2 space-x-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded border inline-block"
                >
                  ダッシュボード
                </Link>
                <button
                  onClick={async () => { await onLogout(); setOpen(false) }}
                  className="px-3 py-2 rounded bg-gray-900 text-white inline-block"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded border inline-block"
                >
                  ログイン
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded bg-blue-600 text-white inline-block"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
