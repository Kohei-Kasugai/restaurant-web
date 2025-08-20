// src/components/MenuPreview.tsx
import React from 'react'

const menus = [
  {
    name: '真鯛のカルパッチョ',
    price: '¥1,280',
    img: 'https://images.unsplash.com/photo-1628280738974-24e582b9904a?q=80&w=870&auto=format&fit=crop',
  },
  {
    name: '牛ほほ肉の赤ワイン煮',
    price: '¥2,400',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: '苺とピスタチオのタルト',
    price: '¥980',
    img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop',
  },
]

export default function MenuPreview() {
  return (
    <section id="menu" className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-3xl md:text-4xl">人気メニュー</h2>
        <a href="/menu" className="text-brand-800 underline">フルメニューを見る</a>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {menus.map((m, i) => (
          <article key={i} className="rounded-xl overflow-hidden bg-white border">
            <img src={m.img} alt="" className="h-48 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{m.name}</h3>
                <span className="text-brand-700">{m.price}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
