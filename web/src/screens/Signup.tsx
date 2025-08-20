// src/screens/Signup.tsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Signup() {
  const { signup, error } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const strongEnough = (pw: string) => pw.length >= 8

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!form.email || !form.password || !form.full_name) {
      setLocalError('必須項目（氏名/メール/パスワード）を入力してください。')
      return
    }
    if (!strongEnough(form.password)) {
      setLocalError('パスワードは8文字以上を推奨します。')
      return
    }

    setSubmitting(true)
    const ok = await signup(form)
    setSubmitting(false)
    if (ok) nav('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">会員登録</h1>

      {(localError || error) && (
        <div className="mb-3 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {localError || error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">氏名</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">メールアドレス</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value.trim() })}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">電話番号（任意）</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">パスワード</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
            required
          />
          <p className="text-xs text-gray-500 mt-1">8文字以上を推奨</p>
        </div>
        <button
          disabled={submitting}
          className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-50"
        >
          {submitting ? '作成中…' : 'アカウント作成'}
        </button>
      </form>

      <p className="mt-3 text-sm">
        既にアカウントをお持ちですか？ <Link to="/login" className="underline">ログイン</Link>
      </p>
    </div>
  )
}
