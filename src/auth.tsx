// src/auth.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type User = { id: number; email: string; full_name: string; phone?: string | null }

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  login: (p: { email: string; password: string }) => Promise<boolean>
  signup: (p: { email: string; password: string; full_name: string; phone?: string }) => Promise<boolean>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const api = async (input: RequestInfo, init?: RequestInit) => {
  // すべてのAPIでCookie送受信を有効化
  const res = await fetch(input, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  return res
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api('/api/auth/me')
      if (res.status === 200) {
        const data = await res.json()
        setUser(data.user)
      } else if (res.status === 401) {
        setUser(null)
      } else {
        // 想定外
        setUser(null)
      }
    } catch (e) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 初回マウント時にセッション確認
    refresh()
  }, [refresh])

  const login: AuthContextType['login'] = async ({ email, password }) => {
    setError(null)
    const res = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      const data = await res.json()
      setUser(data.user)
      return true
    }
    if (res.status === 401) setError('メールアドレスまたはパスワードが違います。')
    else setError('ログインに失敗しました。時間をおいて再実行してください。')
    return false
  }

  const signup: AuthContextType['signup'] = async ({ email, password, full_name, phone }) => {
    setError(null)
    const res = await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name, phone }),
    })
    if (res.status === 201) {
      const data = await res.json()
      setUser(data.user) // サインアップ後に自動ログイン
      return true
    }
    if (res.status === 409) setError('このメールアドレスは既に登録されています。')
    else setError('会員登録に失敗しました。入力内容をご確認ください。')
    return false
  }

  const logout = async () => {
    setError(null)
    try {
      await api('/api/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
