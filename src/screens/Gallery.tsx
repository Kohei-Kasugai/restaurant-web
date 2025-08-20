// src/screens/Gallery.tsx (ライトボックス対応版)
import React, { useEffect, useState } from 'react'

const photos = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", // テーブルと料理
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop", // 店内の様子
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop", // 落ち着いたレストラン空間
  "https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=1200&auto=format&fit=crop", // ダイニングの雰囲気
  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", // ワインと料理
  "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1200&auto=format&fit=crop", // デザート
  "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop", // レストラン外観
  "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1200&auto=format&fit=crop", // バーカウンター
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop"  // ピザ
]

export default function Gallery() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const open = (idx: number) => setActiveIdx(idx)
  const close = () => setActiveIdx(null)
  const next = () => setActiveIdx((i) => (i === null ? null : (i + 1) % photos.length))
  const prev = () => setActiveIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))

  // キーボード操作: Esc/←/→
  useEffect(() => {
    if (activeIdx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIdx])

  return (
    <div>
      <h1 className="text-2xl font-bold">ギャラリー</h1>
      <p className="text-gray-600 mt-1">店内と料理の雰囲気です。</p>

      {/* グリッド */}
      <ul className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <li key={i} className="relative group">
            <button
              onClick={() => open(i)}
              className="block w-full h-48 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label={`写真 ${i + 1} を拡大表示`}
            >
              <img
                src={src}
                alt="料理・店内の写真"
                loading="lazy"
                className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* ライトボックス */}
      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <figure
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={photos[activeIdx]} alt={`拡大写真 ${activeIdx + 1}`} className="w-full h-auto rounded-xl shadow-2xl" />

            {/* 閉じる */}
            <button
              onClick={close}
              aria-label="閉じる"
              className="absolute -top-10 right-0 text-white/90 hover:text-white text-2xl"
            >
              ×
            </button>

            {/* 前後ナビ */}
            <button
              onClick={prev}
              aria-label="前の写真"
              className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="次の写真"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl"
            >
              ›
            </button>

            <figcaption className="mt-2 text-center text-gray-300 text-sm">
              {activeIdx + 1} / {photos.length}（Escで閉じる / ←→で移動）
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  )
}
