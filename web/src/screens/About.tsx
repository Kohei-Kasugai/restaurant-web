// src/screens/About.tsx (拡張版)
import React from 'react'

function Pill({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 mt-1 leading-relaxed">{body}</p>
    </div>
  )
}

function TimelineItem({ year, text }: { year: string; text: string }) {
  return (
    <li className="relative pl-8">
      <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-black" />
      <div className="text-sm text-gray-500">{year}</div>
      <div className="font-medium -mt-0.5">{text}</div>
    </li>
  )
}

export default function About() {
  return (
    <div>
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
          alt="厨房で仕上げる料理"
          className="w-full h-64 md:h-80 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">私たちについて</h1>
          <p className="mt-1 text-white/90">旬の食材を、生産者の想いとともに。</p>
        </div>
      </header>

   {/* Story + Chef */}
    <section className="mt-8 grid md:grid-cols-3 gap-6 items-start">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-xl md:col-span-1">
        <img
          src="https://images.unsplash.com/photo-1730324772289-b00b3cfbd374?q=80&w=1200&auto=format&fit=crop"
          alt="シェフのポートレート"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="md:col-span-2 space-y-4">
        <p className="leading-relaxed">
          当店は、四季折々の素材を主役に据えたモダン・ビストロです。生産者の想いがこもった食材を丁寧に扱い、
          火入れ・出汁・香りの重なりを大切にしながら、一皿ごとに物語のある体験をお届けします。
        </p>
        <p className="leading-relaxed">
          料理長 <span className="font-semibold">山田 太郎（Taro Yamada）</span> は、東京とパリの名店で研鑽を積み、
          2025年に当店をオープンしました。「余白のある料理」をテーマに、盛り込みすぎない美しさと、
          最適な温度での提供にこだわっています。
        </p>
        <p className="leading-relaxed">
          料理は単に味わうものではなく、時間・空間・人とのつながりを楽しむもの。
          お客様の大切な記念日や普段の食卓が、より特別な瞬間になるよう心を込めておもてなししています。
        </p>
        <p className="leading-relaxed">
          また、地域との共生を大切にし、農家や漁師との密な関わりを通じて、安心・安全かつ
          サステナブルな食文化の循環を目指しています。
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>地産地消とサステナブルな取り組み</li>
          <li>ワイン＆ノンアルコースのペアリング提案</li>
          <li>アレルギーや食事制限への柔軟な対応（事前連絡）</li>
        </ul>
      </div>
    </section>


      {/* Concept 3 pillars */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-bold">Concept — 私たちの3つの約束</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-6">
          <Pill title="旬" body="地域の生産者と連携し、いま美味しいものを最短距離でテーブルへ。" />
          <Pill title="余白" body="香りと温度の設計を優先。過度に盛り込まないミニマルな表現。" />
          <Pill title="もてなし" body="一皿の最適温度と提供タイミングを最優先に、席の居心地までデザイン。" />
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-bold">歩み</h2>
        <ol className="mt-4 space-y-4 border-l pl-6">
          <TimelineItem year="2019" text="都内レストランで修行開始" />
          <TimelineItem year="2022" text="各地の生産者とのネットワークを構築" />
          <TimelineItem year="2025" text="当店オープン。季節のコースを提供開始" />
        </ol>
      </section>

      {/* Producers / Partners */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-bold">生産者・パートナー</h2>
        <p className="text-gray-600 mt-1 text-sm">一部をご紹介（敬称略）</p>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: '美濃 川口農園', kind: '有機野菜' },
            { name: '飛騨 田中牧場', kind: '放牧牛乳/バター' },
            { name: '若狭 魚介組合', kind: '鮮魚' },
            { name: '山県 茶園', kind: '和紅茶・ハーブ' },
            { name: '岐阜 奥田養鶏', kind: '平飼い卵' },
            { name: '恵那 ワイナリー', kind: '日本ワイン' },
          ].map((p) => (
            <li key={p.name} className="rounded-xl border bg-white p-4">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">{p.kind}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Press / Awards */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-bold">掲載情報・受賞</h2>
        <ul className="mt-4 grid md:grid-cols-2 gap-4">
          <li className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">2025/06</div>
            <div className="font-medium">雑誌「Gourmet Japan」夏特集 掲載</div>
          </li>
          <li className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">2025/07</div>
            <div className="font-medium">県内シェフ・アワード ノミネート</div>
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-bold">よくあるご質問</h2>
        <div className="mt-4 divide-y rounded-xl border bg-white">
          {[
            { q: 'ドレスコードはありますか？', a: 'スマートカジュアルを推奨していますが、厳密な規定はありません。' },
            { q: 'ベジタリアン対応は可能ですか？', a: '可能です。ご予約時にお知らせください。' },
            { q: 'お子様連れは可能ですか？', a: '小学生以上を目安にお願いしています。個室のご相談も承ります。' },
          ].map((f) => (
            <details key={f.q} className="p-4">
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12">
        <div className="rounded-2xl border bg-black text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div>
            <h3 className="text-xl font-semibold">記念日やビジネスディナーに</h3>
            <p className="text-white/80 text-sm mt-1">季節のコースはWebからご予約いただけます。アレルギー配慮もお気軽に。</p>
          </div>
          <a href="/reserve" className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black hover:opacity-90">予約する</a>
        </div>
      </section>
    </div>
  )
}

