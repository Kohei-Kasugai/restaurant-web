// src/screens/Menu.tsx
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'


// ---- ダミーデータ（必要に応じてAPIに置換可）
const menu = {
  courses: [
    { id: 'course_season', name: '季節のコース', price: 6800, desc: 'アミューズ/前菜/魚/肉/デザート/小菓子（全6品）', badge: '人気' },
    { id: 'course_chef', name: 'シェフズテイスティング', price: 9800, desc: '旬を凝縮したおまかせ（全8品）', badge: 'おすすめ' },
    { id: 'course_vegetarian', name: 'ベジタリアンコース', price: 6200, desc: '動物性不使用。事前予約制', badge: '要予約' },
  ],
  a_la_carte: [
    { name: '牛頬肉の赤ワイン煮', price: 2400, tags: ['S'], season: 'All' },
    { name: '真鯛のカルパッチョ', price: 1280, tags: ['S'], season: 'All' },
    { name: '苺とピスタチオのタルト', price: 980, season: 'All' },
    { name: '春野菜のテリーヌ', price: 980, tags: ['V', 'GF'], season: 'Spring' },
    { name: '初鰹のタタキ 柑橘ソース', price: 1480, season: 'Spring' },
    { name: '冷製とうもろこしスープ', price: 780, tags: ['V'], season: 'Summer' },
    { name: '真鯛のグリル 焦がしレモン', price: 1980, season: 'Summer', badge: 'おすすめ' },
    { name: 'きのこのリゾット', price: 1380, tags: ['V'], season: 'Autumn' },
    { name: 'ビーフシチュー 赤ワイン煮込み', price: 2280, season: 'Winter' },
    { name: 'クラシック ティラミス', price: 680, tags: ['S'], season: 'All' },
  ],
  drinks: [
      { name: 'ペアリングワイン（3杯）', price: 3800 },
      { name: 'ペアリングワイン（5杯）', price: 5800, badge: '人気' },
      { name: 'グラスワイン（赤・白）', price: 900 },
      { name: 'スパークリングワイン', price: 1200 },
      { name: 'クラフトビール', price: 950, note: '日替わりでご用意しています' },
      { name: '自家製ノンアルコール', price: 800, note: '季節で内容が変わります' },
      { name: 'ウーロン茶', price: 500 },
      { name: 'オレンジジュース', price: 500 },
      { name: 'ジンジャーエール', price: 500 },
      ],
}

type Season = 'All' | 'Spring' | 'Summer' | 'Autumn' | 'Winter'
const seasons: Season[] = ['All', 'Spring', 'Summer', 'Autumn', 'Winter']

function PriceRow({ left, right, badge }: { left: React.ReactNode; right: React.ReactNode; badge?: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{left}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">{badge}</span>
          )}
        </div>
      </div>
      <div className="shrink-0 text-gray-700 tabular-nums">{right}</div>
    </li>
  )
}

function yen(n: number) {
  return `¥${n.toLocaleString()}`
}

export default function Menu() {
  const [season, setSeason] = useState<Season>('All')
  const [showRecommended, setShowRecommended] = useState(false)

  const filteredALC = useMemo(() => {
    return menu.a_la_carte.filter((m) => (season === 'All' ? true : m.season === season || m.season === 'All')).filter((m) =>
      showRecommended ? m.badge === 'おすすめ' : true
    )
  }, [season, showRecommended])

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold">メニュー</h1>
        <p className="text-gray-600 mt-1">季節に合わせて内容が変わります。</p>
      </header>

      {/* コース */}
      <section className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold">コース</h2>
          <ul className="mt-3 space-y-3">
            {menu.courses.map((c) => (
              <div key={c.name} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{c.name}</div>
                      {c.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">{c.badge}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                  </div>
                  <div className="text-lg font-semibold tabular-nums">{yen(c.price)}</div>
                </div>
                <div className="mt-3 text-right">
                  <Link
                    to={`/reserve?course_id=${encodeURIComponent(c.id)}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-black text-white hover:opacity-90 text-sm"
                  >
                    このコースで予約
                  </Link>
                </div>
              </div>
            ))}
          </ul>
        </div>

        {/* ドリンク */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold">ドリンク</h2>
          <ul className="mt-3 space-y-2">
            {menu.drinks.map((d) => (
              <PriceRow key={d.name} left={<>{d.name}</>} right={yen(d.price)} badge={d.badge} />
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-3">※ アルコールの提供は法令に従います。運転される方への提供はできません。</p>
        </div>

        {/* アラカルト（季節フィルタ） */}
        <div className="bg-white rounded-xl border p-5 md:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold mr-2">アラカルト</h2>
            <div className="flex items-center gap-2 ml-auto">
              {seasons.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`px-3 py-1.5 rounded-full border text-sm ${season === s ? 'bg-black text-white border-black' : 'bg-white border-gray-300'}`}
                >
                  {s}
                </button>
              ))}
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="scale-110" checked={showRecommended} onChange={(e) => setShowRecommended(e.target.checked)} />
                おすすめのみ
              </label>
            </div>
          </div>

          <ul className="mt-3 grid sm:grid-cols-2 gap-3">
            {filteredALC.map((m) => (
              <li key={m.name} className="rounded-lg border p-4 bg-white/60 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{m.name}</div>
                      {m.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">{m.badge}</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 border">{m.season}</span>
                      {m.tags?.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-gray-100 border">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-gray-700 font-medium tabular-nums">{yen(m.price)}</div>
                </div>
              </li>
            ))}
          </ul>

          {filteredALC.length === 0 && (
            <p className="mt-4 text-gray-500">該当のメニューはありません。</p>
          )}

          <div className="mt-4 text-xs text-gray-500">
            <p>凡例：<span className="px-1.5 py-0.5 rounded bg-gray-100 border">V</span> ベジ、<span className="px-1.5 py-0.5 rounded bg-gray-100 border">GF</span> グルテンフリー、<span className="px-1.5 py-0.5 rounded bg-gray-100 border">S</span> 砂糖を含む</p>
          </div>
        </div>
      </section>

      {/* 追加情報 */}
      <section className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border p-5 bg-white">
          <h3 className="font-semibold">ご予約前のご案内</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>アレルギー・苦手食材は予約時にお知らせください</li>
            <li>仕入れ状況により内容が変更になる場合があります</li>
            <li>記念日メッセージプレート承ります（無料/日本語・英語）</li>
          </ul>
        </div>
        <div className="rounded-xl border p-5 bg-white">
          <h3 className="font-semibold">おすすめの楽しみ方</h3>
          <p className="mt-2 text-sm text-gray-700">初めての方は <span className="font-medium">季節のコース + 3杯ペアリング</span> が人気。小食の方には取り分けしやすいアラカルト構成もご提案します。</p>
        </div>
        <div className="rounded-xl border p-5 bg-white">
          <h3 className="font-semibold">価格表記について</h3>
          <p className="mt-2 text-sm text-gray-700">表示価格は税込です。サービス料はいただいておりません。</p>
        </div>
      </section>

      <div className="mt-8">
        <a href="/reserve" className="inline-block px-4 py-2 rounded bg-gray-900 text-white hover:opacity-90">予約する</a>
      </div>
    </div>
  )
}

