// src/screens/Access.tsx
import React from 'react'

export default function Access() {
  return (
    <div>
      <h1 className="text-2xl font-bold">アクセス</h1>
      <p className="text-gray-600 mt-1">岐阜県〇〇市〇〇 1-2-3 / 岐阜駅 徒歩5分</p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div>営業時間：11:30–14:30 / 18:00–22:00</div>
          <div>定休日：火曜</div>
          <div>電話：03-xxxx-xxxx</div>
          <div>メール：info@example.com</div>
        </div>
        <iframe
          title="map"
          className="w-full h-72 rounded-lg border"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=%E5%B2%90%E9%98%9C%E9%A7%85&hl=ja&z=15&output=embed"
        />
      </div>
    </div>
  )
}
