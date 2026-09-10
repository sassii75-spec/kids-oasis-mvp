import { CATEGORIES, AGE_OPTIONS } from '../lib/constants'
import { CATEGORY_ICONS, IconSparkle, IconRain } from './icons'

const START_OPTIONS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
const WINDOW_OPTIONS = [
  { label: '2시간', minutes: 120 },
  { label: '3시간', minutes: 180 },
  { label: '4시간 (여유)', minutes: 240 },
  { label: '5시간 (넉넉한 일정)', minutes: 300 },
  { label: '6시간 (하루 코스)', minutes: 360 },
  { label: '7시간 (하루 코스)', minutes: 420 },
  { label: '8시간 (종일 코스)', minutes: 480 },
  { label: '9시간 (종일 코스)', minutes: 540 },
  { label: '10시간 (종일 풀 코스)', minutes: 600 },
]

export default function FilterBar({ filters, onChange, onRecommend, recommendDisabled }) {
  const toggleCategory = (key) => {
    const next = new Set(filters.categories)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onChange({ ...filters, categories: next })
  }

  const toggleIndoorOnly = () => {
    onChange({ ...filters, indoorOnly: !filters.indoorOnly })
  }

  return (
    <div className="filter-bar">
      <div className="chip-group">
        {CATEGORIES.map((c) => {
          const active = filters.categories.has(c.key)
          const Icon = CATEGORY_ICONS[c.key]
          return (
            <button
              key={c.key}
              type="button"
              className="chip"
              data-active={active}
              style={active ? { '--chip-bg': c.bg, '--chip-ink': c.ink } : undefined}
              onClick={() => toggleCategory(c.key)}
            >
              <Icon className="icon" />
              {c.label}
            </button>
          )
        })}
      </div>

      <div className="filter-controls-group">
        <label className="select-field">
          아이 연령
          <select value={filters.age} onChange={(e) => onChange({ ...filters, age: e.target.value })}>
            {AGE_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        <label className="select-field">
          출발 시각
          <select value={filters.start} onChange={(e) => onChange({ ...filters, start: e.target.value })}>
            {START_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="select-field">
          여유 시간
          <select
            value={filters.windowMinutes}
            onChange={(e) => onChange({ ...filters, windowMinutes: Number(e.target.value) })}
          >
            {WINDOW_OPTIONS.map((w) => (
              <option key={w.minutes} value={w.minutes}>{w.label}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={`toggle-field ${filters.indoorOnly ? 'is-active' : ''}`}
          onClick={toggleIndoorOnly}
          title="비 오거나 미세먼지 심한 날 100% 실내 장소만 선택"
        >
          <IconRain className="icon" />
          <span>비 오는 날 실내 전용 🌧️</span>
          <span className="toggle-switch-badge">{filters.indoorOnly ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="spacer" />
      <button type="button" className="btn-primary" onClick={onRecommend} disabled={recommendDisabled}>
        <IconSparkle className="icon" style={{ width: 16, height: 16 }} />
        맞춤 코스 추천받기
      </button>
    </div>
  )
}

