// src/components/Footer.tsx
import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Footer() {
  const nav = useNavigate()
  const loc = useLocation()
  const { user } = useAuth()

  function goReserve() {
    const to = '/reserve'
    if (user) {
      nav(to)
    } else {
      // ログイン後に元の場所へ戻す
      nav('/login', { state: { from: { pathname: to } } })
    }
  }

  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-white">
      {/* 上段：情報 & ナビ */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4 text-sm text-gray-700">
        {/* 店舗情報 */}
        <div className="space-y-3">
          <Link to="/" className="font-display text-xl tracking-wide hover:opacity-80">
            Demo Bistro
          </Link>
          <address className="not-italic text-gray-600">
            東京都〇〇区〇〇 1-2-3<br />
            <span className="inline-flex items-center gap-1 text-xs mt-1 rounded-full border px-2 py-1 bg-gray-50">
              営業 11:30–14:30 / 18:00–22:00
            </span>
            <div className="text-xs text-gray-500 mt-1">火曜定休</div>
          </address>
          <div className="text-xs text-gray-500">
            Tel: <a className="underline hover:opacity-80" href="tel:03-0000-0000">03-0000-0000</a>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={goReserve}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2 hover:opacity-90"
              aria-label="オンラインで予約する"
            >
              予約する
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        {/* ナビ：ページ */}
        <nav aria-label="サイトナビゲーション" className="grid grid-cols-2 gap-6 md:grid-cols-1">
          <div>
            <div className="font-semibold mb-2">ページ</div>
            <ul className="space-y-1">
              <li><Link className="hover:underline" to="/">Home</Link></li>
              <li><Link className="hover:underline" to="/menu">Menu</Link></li>
              <li><Link className="hover:underline" to="/about">About</Link></li>
              <li><Link className="hover:underline" to="/gallery">Gallery</Link></li>
              <li><Link className="hover:underline" to="/news">News</Link></li>
              <li><Link className="hover:underline" to="/events">Events</Link></li>
              <li><Link className="hover:underline" to="/access">Access</Link></li>
              <li><Link className="hover:underline" to="/contact">Contact</Link></li>
            </ul>
          </div>
        </nav>

        {/* ご案内 */}
        <div>
          <div className="font-semibold mb-2">ご案内</div>
          <ul className="space-y-1">
            <li><Link className="hover:underline" to="/access">アクセス</Link></li>
            <li><Link className="hover:underline" to="/news">アレルギー・食材について</Link></li>
            <li><Link className="hover:underline" to="/news">プライバシーポリシー</Link></li>
            <li>
              <Link
                className="hover:underline"
                to={{ pathname: '/reserve' }}
                state={user ? undefined : { from: { pathname: loc.pathname } }}
              >
                予約の変更・キャンセル
              </Link>
            </li>
          </ul>
        </div>

        {/* ミニサブスク（将来API接続用の雛形） */}
        <div>
          <div className="font-semibold mb-2">最新情報を受け取る</div>
          <p className="text-gray-600">季節メニューやイベントをメールでお知らせします。</p>
          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); alert('仮: メール登録（実装は後で）') }}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full border rounded-md px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-md border px-3 py-2 hover:bg-gray-50"
            >
              登録
            </button>
          </form>
          <div className="flex items-center gap-3 mt-3 text-gray-500">
            {/* 簡易SNSアイコン（SVG） */}
            <a href="#" aria-label="Instagram" className="hover:text-gray-700">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2a3 3 0 1 1-.001 6.001A3 3 0 0 1 12 9zm5.5-2.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/></svg>
            </a>
            <a href="#" aria-label="X" className="hover:text-gray-700">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3 3h4.6l4.1 6.2L16.9 3H21l-7.3 9.5L21 21h-4.6l-4.5-6.7L7.1 21H3l7.6-9.9L3 3z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* 下段：コピーライト */}
      <div className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2">
          <div>© {year} Demo Bistro</div>
          <div className="space-x-4">
            <Link className="hover:underline" to="/news">利用規約</Link>
            <Link className="hover:underline" to="/news">プライバシー</Link>
            <a className="hover:underline" href="#top">TOPへ戻る</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
