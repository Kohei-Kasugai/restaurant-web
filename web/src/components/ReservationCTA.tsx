// src/components/ReservationCTA.tsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function ReservationCTA() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-16">
      <div className="rounded-2xl bg-brand-800 text-white px-6 py-10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="font-display text-2xl md:text-3xl">ご予約はオンラインで</h3>
          <p className="mt-2 text-white/90">空席の確認から予約完了まで、数クリックで完了。</p>
        </div>
        <Link to="/reserve" className="px-6 py-3 rounded bg-accent text-black font-semibold">
          予約をはじめる
        </Link>
      </div>
    </section>
  )
}
