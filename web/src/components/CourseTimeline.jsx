import { CATEGORY_MAP } from '../lib/constants'
import { CATEGORY_ICONS } from './icons'

function CourseCard({ course, index, selected, onSelectCourse, onOpenDetail }) {
  const firstStep = course.steps[0]
  const lastStep = course.steps[course.steps.length - 1]
  const navUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
    lastStep.place.name
  )},${lastStep.place.coord?.lat || ''},${lastStep.place.coord?.lng || ''}`

  return (
    <div
      className={`edge-course-card ${selected ? 'is-selected' : ''}`}
      onClick={() => onSelectCourse && onSelectCourse(index)}
    >
      {/* Course Header */}
      <div className="edge-course-head">
        <div className="head-title-group">
          <span className="course-badge">코스 {index + 1}</span>
          <span className="course-summary-pill">
            {course.steps.length}개 장소 순회
          </span>
        </div>
        <div className="course-total-stat">
          <span className="total-time">⏱️ 총 {Math.floor(course.totalMinutes / 60)}시간 {Math.round(course.totalMinutes % 60)}분</span>
          <span className="total-dist">🚗 이동 {course.totalDistanceKm}km</span>
          <span className="total-budget-badge">💰 예산 {course.estimatedCostText || '약 3~5만원대'}</span>
        </div>
      </div>

      {/* Vertical Route Dispatch List */}
      <div className="edge-timeline">
        {/* 출발지 노드 (현재 위치) */}
        <div className="edge-step-item start-origin-item">
          <div className="step-left-col">
            <div className="step-role-circle role-start">
              출발
            </div>
            <div className="connector-line">
              <div className="dashed-line" />
            </div>
          </div>
          <div className="step-right-col">
            <div className="edge-origin-card">
              <div className="origin-icon-box">📍</div>
              <div className="origin-info">
                <div className="name-row">
                  <h5>{course.startLocationName || '현재 위치'}</h5>
                  <span className="time-badge">{course.startLabel || '출발'}</span>
                </div>
                <div className="address-text">
                  내 위치 기반 추천 동선 시작
                </div>
              </div>
            </div>
            {firstStep && firstStep.travelMinFromPrev && (
              <div className="edge-travel-indicator">
                <span className="travel-icon">🚗</span>
                <span>이동 약 <strong>{firstStep.travelMinFromPrev}분</strong> ({firstStep.distanceKmFromPrev}km)</span>
              </div>
            )}
          </div>
        </div>

        {/* 장소 스탑 노드 목록 */}
        {course.steps.map((s, i) => {
          const cat = CATEGORY_MAP[s.place.category]
          const Icon = CATEGORY_ICONS[s.place.category]
          const isLast = i === course.steps.length - 1

          let stepRoleLabel = `스탑 ${i + 1}`
          let stepRoleClass = 'role-step'
          if (isLast) {
            stepRoleLabel = '도착'
            stepRoleClass = 'role-end'
          }

          const nextStep = course.steps[i + 1]

          return (
            <div className="edge-step-item" key={s.place.id}>
              {/* Step Connection Column (Left) */}
              <div className="step-left-col">
                <div className={`step-role-circle ${stepRoleClass}`}>
                  {stepRoleLabel}
                </div>
                {!isLast && (
                  <div className="connector-line">
                    <div className="dashed-line" />
                  </div>
                )}
              </div>

              {/* Step Content Column (Right) */}
              <div className="step-right-col">
                <div
                  className="edge-place-card"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onSelectCourse) onSelectCourse(index)
                    if (onOpenDetail) onOpenDetail(s.place)
                  }}
                >
                  <div className="edge-thumb-box">
                    {s.place.image_url ? (
                      <img src={s.place.image_url} alt={s.place.name} className="edge-thumb-img" />
                    ) : (
                      cat && Icon && (
                        <div className="thumb-fallback" style={{ background: cat.bg, color: cat.ink }}>
                          <Icon className="icon" />
                        </div>
                      )
                    )}
                  </div>

                  <div className="edge-place-info">
                    <div className="name-row">
                      <h5>{s.place.name}</h5>
                      <span className="time-badge">{s.startLabel}~{s.endLabel}</span>
                    </div>

                    <div className="address-text">
                      📍 {s.place.address || s.place.region}
                    </div>

                    {cat && (
                      <div className="cat-tag-row">
                        <span className="cat-micro-tag" style={{ background: cat.bg, color: cat.ink }}>
                          {cat.label}
                        </span>
                        {s.place.duration_min && (
                          <span className="duration-tag">{s.place.duration_min}분 체류</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical Travel Time Indicator pill between steps */}
                {!isLast && nextStep && nextStep.travelMinFromPrev && (
                  <div className="edge-travel-indicator">
                    <span className="travel-icon">⏱️</span>
                    <span>다음 스탑까지 : <strong>약 {nextStep.travelMinFromPrev}분</strong> ({nextStep.distanceKmFromPrev}km)</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Fixed Edge CTA Button (호출하기 스타일) */}
      <div className="edge-bottom-cta">
        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="edge-action-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="btn-icon">🚗</span>
          <span className="btn-text">이 코스로 출발하기 (카카오맵 길찾기)</span>
        </a>
      </div>
    </div>
  )
}

export default function CourseTimeline({ courses, selectedCourseIndex, onSelectCourse, onOpenDetail }) {
  if (!courses) {
    return (
      <div className="empty-state">
        위에서 아이 연령 · 출발 시각 · 여유 시간을 고른 뒤<br />
        “맞춤 코스 추천받기”를 눌러보세요.
      </div>
    )
  }
  if (courses.length === 0) {
    return <div className="empty-state">조건에 맞는 코스를 만들지 못했어요. 여유 시간을 늘리거나 카테고리를 더 선택해보세요.</div>
  }
  return (
    <div className="course-timeline-list">
      {courses.map((c, i) => (
        <CourseCard
          key={c.id}
          course={c}
          index={i}
          selected={i === selectedCourseIndex}
          onSelectCourse={onSelectCourse}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  )
}
