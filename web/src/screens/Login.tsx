// src/screens/Login.tsx
import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Login() {
  const { login, error } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // 直前にアクセスしようとしていた場所（例: /reserve）
  const from = (location.state as any)?.from

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!form.email || !form.password) {
      setLocalError('メールアドレスとパスワードを入力してください。')
      return
    }

    setSubmitting(true)
    try {
      const ok = await login(form) // useAuth の login({email, password})
      if (ok) {
        // /reserve など元のURLに戻す。なければ /dashboard
        const redirectTo =
          (from && (from.pathname || '/')) +
          (from?.search || '') +
          (from?.hash || '') || '/dashboard'
        nav(redirectTo, { replace: true })
      }
    } catch (e: any) {
      setLocalError(e?.error || 'ログインに失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>

      {(localError || error) && (
        <div className="mb-3 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {localError || error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
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
          <label className="block text-sm mb-1">パスワード</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          disabled={submitting}
          className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-50"
        >
          {submitting ? '送信中…' : 'ログイン'}
        </button>
      </form>

      <p className="mt-3 text-sm">
        初めての方は <Link to="/signup" className="underline">会員登録</Link>
      </p>
    </div>
  )
}
