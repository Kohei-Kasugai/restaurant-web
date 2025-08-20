// src/components/Features.tsx
import React from 'react'

const items = [
  { title: '季節素材', desc: '旬の食材を中心にメニューを構成。' },
  { title: 'ソムリエ厳選', desc: '料理に合わせたワインペアリング。' },
  { title: 'オンライン予約', desc: 'スムーズに来店予約が完了。' },
]

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="font-display text-3xl md:text-4xl">Demo Bistro のこだわり</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {items.map((f, i) => (
          <div key={i} className="rounded-xl border bg-white p-6">
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
