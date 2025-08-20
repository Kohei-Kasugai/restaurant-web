// src/screens/Events.tsx
import React from 'react'

export default function Events() {
  return (
    <div>
      <h1 className="text-2xl font-bold">貸切・パーティー</h1>
      <p className="text-gray-600 mt-1">20〜40名まで、立食/着席どちらも対応可能です。</p>
      <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
        <li>お一人様 ¥6,000〜（フリードリンク別）</li>
        <li>プロジェクター/マイク貸出</li>
        <li>アレルギー対応可（事前要相談）</li>
      </ul>
      <a href="/contact" className="inline-block mt-6 px-4 py-2 rounded bg-brand-700 text-white hover:bg-brand-800">ご相談はこちら</a>
    </div>
  )
}