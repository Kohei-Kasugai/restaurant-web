import React, { useEffect, useMemo, useState } from 'react'
import { ReservationAPI, Reservation, TimeSlot } from '../api'
import Modal from '../components/Modal'

type Row = Reservation & {
  timeslot?: Pick<TimeSlot, 'start_time' | 'end_time'>
}

// （任意）IDしか無い時のための簡易ラベル表
const COURSE_LABELS: Record<string, { name: string; price?: number }> = {
  course_season: { name: '季節のコース', price: 6800 },
  course_chef: { name: 'シェフズテイスティング', price: 9800 },
  course_vegetarian: { name: 'ベジタリアンコース', price: 6200 },
  course_no: { name: 'コースを選ばない', price: 0 },
  1: { name: '季節のコース',         price: 6800 },
  2: { name: 'シェフズテイスティング', price: 9800 },
  3: { name: 'ベジタリアンコース',     price: 6200 },
}

// 予約オブジェクトからコース情報を取り出す（トップレベル or metadata どちらでもOK）
function extractCourse(r: any): { id?: string; name?: string; price?: number } {
  const meta = r?.metadata ?? {}
  const idRaw = r?.course_id ?? meta?.course_id
  const code   = r?.course_code ?? meta?.course_code
  const name = r?.course_name ?? meta?.course_name
  const price = r?.course_price ?? meta?.course_price

  //正規化
  const idNum  = typeof idRaw === 'string' && /^\d+$/.test(idRaw) ? Number(idRaw) : idRaw
  const idKey  = (idNum ?? code) as string | number | undefined

  // ラベル補完
   const fallback = (idKey != null && COURSE_LABELS[idKey]) ? COURSE_LABELS[idKey] : undefined
  return {
    id: idNum ?? code,                                 // どちらか存在する方を返す
    name: (typeof name === 'string' && name) || fallback?.name,
    price: typeof price === 'number' ? price
         : (typeof price === 'string' ? Number(price) : fallback?.price),
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Row[]>([])

  // モーダル
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Row | null>(null)
  const [working, setWorking] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // 一覧読み込み
  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const [resvs, slots] = await Promise.all([
          ReservationAPI.my(),
          ReservationAPI.timeslots(),
        ])
        const slotById = new Map(slots.map((s: TimeSlot) => [s.id, s]))
        const rows: Row[] = resvs.map((r: Reservation) => ({
          ...r,
          timeslot: slotById.get(r.timeslot_id)
            ? {
                start_time: slotById.get(r.timeslot_id)!.start_time,
                end_time: slotById.get(r.timeslot_id)!.end_time,
              }
            : undefined,
        }))
        if (alive) setItems(rows)
      } catch (e: any) {
        if (alive) setError('予約の取得に失敗しました')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [])

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.created_at || '').localeCompare(b.created_at || '')),
    [items]
  )

  function openDetail(row: Row) {
    setActive(row)
    setOpen(true)
  }

  async function onCancel(id: number) {
    if (working) return
    setWorking(true)
    try {
      await ReservationAPI.cancel(id)
      // 楽観更新
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'canceled' } : x)))
      setToast('予約をキャンセルしました')
      setOpen(false)
    } catch (e: any) {
      setToast('キャンセルに失敗しました')
    } finally {
      setWorking(false)
      // トースト自動消し
      setTimeout(() => setToast(null), 2000)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">予約一覧</h1>
      <p className="text-gray-600 mt-1">あなたの予約一覧です。詳細からキャンセルできます。</p>

      {toast && (
        <div className="mt-3 rounded bg-green-50 border border-green-200 px-3 py-2 text-green-800">
          {toast}
        </div>
      )}
      {error && (
        <div className="mt-3 rounded bg-red-50 border border-red-200 px-3 py-2 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">予約ID</th>
              <th className="p-3 text-left">日付</th>
              <th className="p-3 text-left">時間</th>
              <th className="p-3 text-left">人数</th>
              <th className="p-3 text-left">コース</th> {/* ← 追加 */}
              <th className="p-3 text-left">状態</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4" colSpan={7}>
                  読み込み中...
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-600" colSpan={7}>
                  予約はありません。
                </td>
              </tr>
            ) : (
              sorted.map((r) => {
                const course = extractCourse(r)
                return (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{r.id}</td>
                    <td className="p-3">{r.date}</td>
                    <td className="p-3">
                      {r.timeslot ? `${r.timeslot.start_time} - ${r.timeslot.end_time}` : `#${r.timeslot_id}`}
                    </td>
                    <td className="p-3">{r.party_size} 名</td>
                    <td className="p-3">
                      {course.name
                        ? course.name
                        : course.id
                        ? `ID: ${course.id}`
                        : '—'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          r.status === 'booked' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {r.status === 'booked' ? '予約中' : 'キャンセル'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="px-3 py-1 rounded border hover:bg-gray-50" onClick={() => openDetail(r)}>
                        詳細
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 予約詳細モーダル */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="予約の詳細"
        footer={
          <div className="flex justify-between">
            <button className="px-3 py-2 rounded border" onClick={() => setOpen(false)}>
              閉じる
            </button>
            {active?.status === 'booked' && (
              <button
                onClick={() => active && onCancel(active.id)}
                disabled={working}
                className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-50"
              >
                {working ? '処理中…' : 'キャンセルする'}
              </button>
            )}
          </div>
        }
      >
        {active ? (
          (() => {
            const course = extractCourse(active)
            const total =
              typeof course.price === 'number' ? course.price * (active.party_size ?? 1) : null
            return (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">予約ID：</span>
                  {active.id}
                </div>
                <div>
                  <span className="text-gray-500">日付：</span>
                  {active.date}
                </div>
                <div>
                  <span className="text-gray-500">時間：</span>
                  {active.timeslot
                    ? `${active.timeslot.start_time} - ${active.timeslot.end_time}`
                    : `#${active.timeslot_id}`}
                </div>
                <div>
                  <span className="text-gray-500">人数：</span>
                  {active.party_size} 名
                </div>
                <div>
                  <span className="text-gray-500">コース：</span>
                  {course.name
                    ? course.name
                    : course.id
                    ? `ID: ${course.id}`
                    : '—'}
                  {typeof course.price === 'number' && (
                    <span className="ml-2 text-gray-700">
                      （¥{course.price.toLocaleString()} / お一人様）
                    </span>
                  )}
                </div>
                {typeof total === 'number' && (
                  <div>
                    <span className="text-gray-500">概算合計：</span>
                    <span className="font-medium">
                      ¥{total.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-1 text-xs">※ 税込・サービス料なし</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">状態：</span>
                  {active.status === 'booked' ? '予約中' : 'キャンセル'}
                </div>
                {active.created_at && (
                  <div>
                    <span className="text-gray-500">作成：</span>
                    {new Date(active.created_at).toLocaleString()}
                  </div>
                )}
              </div>
            )
          })()
        ) : (
          <div>読み込み中...</div>
        )}
      </Modal>
    </div>
  )
}
