// src/screens/Contact.tsx
import React, { useState } from 'react'

export default function Contact() {
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 800)) // ダミー
    setSending(false)
    setDone(true)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">お問い合わせ</h1>
      <p className="text-gray-600 mt-1">各種ご相談はこちらから。</p>
      {done ? (
        <div className="mt-6 p-4 rounded bg-green-50 text-green-800 border border-green-200">
          送信しました。担当より返信いたします。
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="お名前" required />
          <input className="w-full border rounded px-3 py-2" placeholder="メールアドレス" type="email" required />
          <textarea className="w-full border rounded px-3 py-2" placeholder="内容" rows={5} required />
          <button className="px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-50" disabled={sending}>
            {sending ? '送信中…' : '送信する'}
          </button>
        </form>
      )}
    </div>
  )
}
