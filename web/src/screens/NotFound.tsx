// src/screens/NotFound.tsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-bold">ページが見つかりません</h1>
      <p className="text-gray-600 mt-2">URLが正しいかご確認ください。</p>
      <Link to="/" className="inline-block mt-6 px-4 py-2 rounded border">ホームへ戻る</Link>
    </div>
  )
}
