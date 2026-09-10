import { useState } from 'react'
import { CATEGORY_MAP } from '../lib/constants'
import { CATEGORY_ICONS, IconGift, IconSparkle } from './icons'

export default function CourseRecommendationModal({ courses, onConfirmCourse, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!courses || courses.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container course-modal-container" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
          <div className="empty-state">
            선택한 조건에 알맞은 코스를 만들지 못했습니다. <br />
            여유 시간을 늘리거나 카테고리를 더 선택해 주세요.
          </div>
        </div>
      </div>
    )
  }

  const currentCourse = courses[selectedIndex] || courses[0]

  // 코스 옵션 테마 타이틀
  const optionThemes = [
    { title: '🏛️ 코스 1: 문화탐험 코스', badge: '강력추천', desc: '역사, 지식, 다채로운 유체험 연계' },
    { title: '🌿 코스 2: 힐링산책 코스', badge: '여유형', desc: '자연 수목원과 인근 카페 힐링' },
    { title: '⚡ 코스 3: 액티비티 코스', badge: '체력소진', desc: '아이 체력을 신나게 소진하는 파워 코스' },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container course-modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        {/* Modal Header */}
        <div className="course-modal-header">
          <div className="course-modal-title">
            <IconSparkle className="title-sparkle-icon" />
            <h2>맞춤 키즈 코스 추천</h2>
          </div>
          <p className="course-modal-sub">
            원하는 코스 옵션을 선택한 후 <strong>"이 코스로 확정하기"</strong>를 눌러 지도에서 확인해보세요.<br />
            <span className="summary-budget-pill">
              ⏱️ 총 소요시간: 약 {Math.floor(currentCourse.totalMinutes / 60)}시간 {currentCourse.totalMinutes % 60}분 &nbsp;|&nbsp; 💰 예상 총 예산: {currentCourse.estimatedCostText || '약 3~5만원대'}
            </span>
          </p>

          {/* Course Options Tabs */}
          <div className="course-option-tabs">
            {courses.slice(0, 3).map((c, idx) => {
              const theme = optionThemes[idx] || { title: `코스 ${idx + 1}`, badge: '추천' }
              const isSelected = idx === selectedIndex
              const hours = Math.floor(c.totalMinutes / 60)
              const mins = Math.round(c.totalMinutes % 60)
              const timeStr = hours > 0 ? `${hours}시간 ${mins > 0 ? `${mins}분` : ''}` : `${mins}분`
              return (
                <button
                  key={c.id || idx}
                  type="button"
                  className={`course-tab-btn ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedIndex(idx)}
                >
                  <span className="tab-theme-badge">{theme.badge}</span>
                  <span className="tab-title">{theme.title}</span>
                  <span className="tab-meta">⏱️ {timeStr} · 💰 {c.estimatedCostText || '예산 산출'}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Horizontal 3-Stop Cards Flow (Screenshot 3 Design) */}
        <div className="course-modal-body">
          <div className="three-stop-cards-row">
            {currentCourse.steps.map((step, sIdx) => {
              const place = step.place
              const cat = CATEGORY_MAP[place.category]
              const Icon = CATEGORY_ICONS[place.category]
              const cardColorClass = sIdx === 0 ? 'card-blue' : sIdx === 1 ? 'card-green' : 'card-orange'
              const isLast = sIdx === currentCourse.steps.length - 1

              return (
                <div key={place.id} className="stop-card-wrapper">
                  <div className={`stop-card ${cardColorClass}`}>
                    <div className="stop-card-head">
                      <div className="icon-circle">
                        {Icon ? <Icon className="icon" /> : '📍'}
                      </div>
                      <h4 className="stop-title">Stop {sIdx + 1}: {place.name}</h4>
                      <div className="stop-duration">
                        ⏰ ({place.duration_min || 60}분 {sIdx === 1 ? '식사/휴식' : '체류'})
                      </div>
                    </div>

                    {/* Oasis Pass Benefit Tag (Screenshot 3 Design) */}
                    {place.oasis_pass_benefit ? (
                      <div className="stop-benefit-badge">
                        <IconGift className="icon" /> {place.oasis_pass_benefit}
                      </div>
                    ) : sIdx === 1 ? (
                      <div className="stop-benefit-badge">
                        <IconGift className="icon" /> 아이 음료 무료 혜택
                      </div>
                    ) : null}

                    <p className="stop-desc">
                      {place.description || `${place.category} 추천 장소입니다.`}
                    </p>
                  </div>

                  {!isLast && (
                    <div className="stop-arrow">
                      ➜
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal Footer Confirm Action */}
        <div className="course-modal-footer">
          <button
            type="button"
            className="btn-confirm-course"
            onClick={() => {
              onConfirmCourse(selectedIndex)
              onClose()
            }}
          >
            <IconSparkle className="icon" />
            이 코스로 확정하기 (지도 & 타임라인 보기)
          </button>
        </div>
      </div>
    </div>
  )
}
