import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Hero() {
  const nav = useNavigate()
  const { user } = useAuth()

  function goReserve() {
    if (user) {
      nav('/reserve')
    } else {
      // ログイン後に /reserve へ戻す
      nav('/login', { state: { from: { pathname: '/reserve' } } })
    }
  }

  return (
    <section className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1600&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-28 text-white">
        <h1 className="font-display text-4xl md:text-6xl font-semibold drop-shadow">
          季節の食材を愉しむ、<br/>モダン・ビストロ
        </h1>
        <p className="mt-4 text-lg max-w-xl drop-shadow">
          旬の味わいをシンプルに。前菜からデザートまで、一皿ごとに物語を。
        </p>
        <div className="mt-8 flex gap-3">
          <a href="/menu" className="px-5 py-3 rounded border border-white/70 hover:bg-white/10 transition">
            メニューを見る
          </a>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    </section>
  )
}