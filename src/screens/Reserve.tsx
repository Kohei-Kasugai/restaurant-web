// src/screens/Reserve.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ReservationAPI, TimeSlot } from '../api'   // ← 既存
import { useAuth } from '../auth'

function todayYYYYMMDD() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

type Course = { id: string; name: string; price: number; desc?: string; badge?: string }

// UIに出すコース候補（必要に応じてAPI化OK）
const COURSE_CATALOG: Course[] = [
  { id: 'course_season', name: '季節のコース', price: 6800, desc: 'アミューズ/前菜/魚/肉/デザート（全6品）', badge: '人気' },
  { id: 'course_chef', name: 'シェフズテイスティング', price: 9800, desc: '旬を凝縮したおまかせ（全8品）', badge: 'おすすめ' },
  { id: 'course_vegetarian', name: 'ベジタリアンコース', price: 6200, desc: '動物性不使用・事前予約制', badge: '要予約' },
  { id: 'course_no', name: 'コースを選ばない', price: 0, desc: '単品注文で承ります' },
]

export default function Reserve() {
  const { user, loading: authLoading } = useAuth()
  const nav = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [date, setDate] = useState(todayYYYYMMDD())
  const [party, setParty] = useState(2)
  const [selected, setSelected] = useState<TimeSlot | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = useState(false)
  const [doneId, setDoneId] = useState<number | null>(null)

  // 新規: コース選択
  const [courseId, setCourseId] = useState<string>('') // 未選択 = 空文字
  const [searchParams] = useSearchParams();

  useEffect(() => {
  const qId = searchParams.get('course_id');
  const qName = searchParams.get('course');

  if (qId) {
    const hit = COURSE_CATALOG.find(c => c.id === qId);
    if (hit) setCourseId(hit.id);
    return;
  }
  if (qName) {
    const hit = COURSE_CATALOG.find(c => c.name === qName);
    if (hit) setCourseId(hit.id);
  }
}, [searchParams]);

  // 未ログインならログインへ
  useEffect(() => {
    if (!authLoading && !user) nav('/login', { replace: true })
  }, [authLoading, user, nav])

  // スロット取得
  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    ReservationAPI.timeslots()
      .then((data) => { if (alive) setSlots(data) })
      .catch(() => { if (alive) setError('スロット取得に失敗しました') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  // 日付変更時に選択をリセット
  useEffect(() => {
    setSelected(null)
  }, [date])

  const sorted = useMemo(
    () => [...slots].sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [slots]
  )

  const selectedCourse = useMemo(() => COURSE_CATALOG.find(c => c.id === courseId) || null, [courseId])

  const canNext =
    step === 1 ? Boolean(date && party > 0 && courseId) :
    step === 2 ? Boolean(selected) :
    true

  async function onSubmit() {
    if (!selected || submitting) return
    try {
      setSubmitting(true)
      setError(null)

      // 既存APIが拡張未対応でも壊れないように:
      // - course_id / course_name / course_price を metadata にも入れて送る
      const payload: any = {
        restaurant_id: selected.restaurant_id,
        timeslot_id: selected.id,
        date,
        party_size: party,
      }
      if (selectedCourse) {
        // 想定: サーバーが受け取れるなら直接渡す
        payload.course_id = selectedCourse.id
        payload.course_name = selectedCourse.name
        payload.course_price = selectedCourse.price
        // バックエンドが未知のフィールドを弾く場合に備えて metadata にも格納
        payload.metadata = {
          ...(payload.metadata || {}),
          course_id: selectedCourse.id,
          course_name: selectedCourse.name,
          course_price: selectedCourse.price,
        }
      }

      const result = await ReservationAPI.create(payload)
      setDoneId(result.reservation.id)
      setStep(3)
    } catch (e: any) {
      const code = e?.payload?.error || e?.message
      const msg =
        code === 'duplicate_booking' ? '同一の日時で既に予約があります'
        : code === 'capacity_exceeded' ? '満席のため予約できません'
        : '予約に失敗しました'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // 認証状態確認中
  if (authLoading) return <div className="p-6">読み込み中…</div>
  // 未ログインなら useEffect がリダイレクトするまで待機
  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">予約</h1>
      <p className="text-gray-600 mt-1">日付・人数・コースを選んで、空き時間から予約します。</p>

      {/* ステッパー */}
      <div className="flex items-center gap-3 mt-6">
        {['条件選択', '時間選択', '確認/完了'].map((label, i) => {
          const s = (i + 1) as 1 | 2 | 3
          const active = step === s
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {s}
              </div>
              <span className={`${active ? 'font-semibold' : 'text-gray-600'}`}>{label}</span>
              {s !== 3 && <span className="text-gray-300">—</span>}
            </div>
          )
        })}
      </div>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

      {/* Step 1: 条件 */}
      {step === 1 && (
        <section className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">日付</span>
              <input
                type="date"
                className="mt-1 w-full border rounded px-3 py-2"
                value={date}
                min={todayYYYYMMDD()}
                onChange={(e) => { setDate(e.target.value); setError(null) }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">人数</span>
              <select
                className="mt-1 w-full border rounded px-3 py-2"
                value={party}
                onChange={(e) => { setParty(parseInt(e.target.value)); setError(null) }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} 名</option>
                ))}
              </select>
            </label>
          </div>

          {/* コース選択（Radio Group） */}
          <fieldset className="mt-6">
            <legend className="flex items-center justify-between w-full">
              <h2 className="font-semibold">コース選択</h2>
              {!courseId && <span className="text-xs text-red-600">※ コースをお選びください</span>}
            </legend>

            <ul className="mt-3 grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="コース">
              {COURSE_CATALOG.map((c) => {
                const active = c.id === courseId
                const disabled = Boolean((c as any).soldOut) // 任意: soldOut フラグに対応
                const radioId = `course-${c.id}`

                return (
                  <li key={c.id}>
                    <label
                      htmlFor={radioId}
                      onClick={() => { if (!disabled) { setCourseId(c.id); setError(null); } }}
                      className={`block w-full border rounded-lg p-4 cursor-pointer transition ${
                        disabled
                          ? 'opacity-60 cursor-not-allowed bg-gray-50'
                          : active
                            ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50/40'
                            : 'hover:border-gray-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{c.name}</span>
                            {c.badge && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                                {c.badge}
                              </span>
                            )}
                            {disabled && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 border whitespace-nowrap">
                                満席
                              </span>
                            )}
                          </div>
                          {c.desc && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.desc}</p>}
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="font-semibold tabular-nums">¥{c.price.toLocaleString()}</div>
                          <div className="text-[11px] text-gray-500">お一人様</div>
                        </div>
                      </div>

                      {/* 視覚的には非表示、キーボード/スクリーンリーダー用 */}
                      <input
                        id={radioId}
                        type="radio"
                        name="course"
                        value={c.id}
                        className="sr-only"
                        checked={active}
                        disabled={disabled}
                        onChange={() => { if (!disabled) { setCourseId(c.id); setError(null); } }}
                      />
                    </label>
                  </li>
                )
              })}
            </ul>
          </fieldset>


          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              disabled={!canNext}
              onClick={() => { setStep(2); setError(null) }}
            >
              時間を選ぶ
            </button>
          </div>
        </section>
      )}

      {/* Step 2: 時間選択 */}
      {step === 2 && (
        <section className="mt-6">
          {loading ? (
            <div className="text-gray-600">読み込み中...</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sorted.map((t) => {
                const active = selected?.id === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => { setSelected(t); setError(null) }}
                    className={`border rounded p-3 text-left hover:border-gray-900
                      ${active ? 'ring-2 ring-blue-600 border-blue-600' : ''}`}
                  >
                    <div className="font-semibold">{t.start_time} - {t.end_time}</div>
                    <div className="text-xs text-gray-600 mt-1">定員 {t.capacity} 名</div>
                  </button>
                )
              })}
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <button className="px-4 py-2 rounded border" onClick={() => setStep(1)}>戻る</button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              disabled={!canNext}
              onClick={() => setStep(3)}
            >
              確認へ進む
            </button>
          </div>
        </section>
      )}

      {/* Step 3: 確認/完了 */}
      {step === 3 && (
        <section className="mt-6 space-y-4">
          {doneId ? (
            <div className="p-4 border rounded bg-green-50 text-green-800 space-y-3">
              <div>予約が完了しました（予約ID: {doneId}）。ダッシュボードから確認できます。</div>
              <a href="/dashboard" className="inline-block px-4 py-2 rounded bg-gray-900 text-white">ダッシュボードへ</a>
            </div>
          ) : (
            <>
              <div className="border rounded p-4 bg-white">
                <h3 className="font-semibold">内容の確認</h3>
                <ul className="mt-2 text-sm text-gray-700 space-y-1">
                  <li>日付：{date}</li>
                  <li>人数：{party} 名</li>
                  <li>コース：{selectedCourse ? `${selectedCourse.name}（¥${selectedCourse.price.toLocaleString()}）` : '—'}</li>
                  <li>時間：{selected?.start_time} - {selected?.end_time}</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded border" onClick={() => setStep(2)}>戻る</button>
                <button
                  className="px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-50"
                  disabled={submitting}
                  onClick={onSubmit}
                >
                  {submitting ? '送信中…' : 'この内容で予約する'}
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}
