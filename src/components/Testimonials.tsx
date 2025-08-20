// src/components/Testimonials.tsx
import React from 'react'

const voices = [
  { name: 'K.S', text: '前菜からデザートまでバランスが素晴らしい。季節ごとに通いたい。' },
  { name: 'M.T', text: 'ワインペアリングが的確で、料理がさらに引き立った。' },
  { name: 'Y.H', text: '落ち着いた雰囲気で記念日に最適。サービスも心地よい。' },
]

export default function Testimonials() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl">お客様の声</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {voices.map((v, i) => (
            <blockquote key={i} className="rounded-xl border p-6 bg-brand-50">
              <p className="text-gray-800 leading-relaxed">“{v.text}”</p>
              <footer className="mt-4 text-sm text-gray-600">— {v.name} 様</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
