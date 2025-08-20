// src/screens/News.tsx
import React from 'react'

const posts = [
  { date: '2025-08-01', title: '秋のコース開始', body: '9/1より秋のコースを提供します。' },
  { date: '2025-07-10', title: '夏季休業のお知らせ', body: '8/12-15は休業いたします。' },
  { date: '2025-06-15', title: '営業時間変更', body: '7月より土日のランチタイムは11:30から営業します。' },
  { date: '2025-05-20', title: '新ワイン入荷', body: 'フランス・ブルゴーニュ産の限定ワインを仕入れました。' },
]

export default function News() {
  return (
    <div>
      <h1 className="text-2xl font-bold">お知らせ</h1>
      <div className="mt-6 space-y-4">
        {posts.map((p, i) => (
          <article key={i} className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition">
            <div className="text-xs text-gray-500">{p.date}</div>
            <h2 className="font-semibold mt-1 text-lg">{p.title}</h2>
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{p.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
