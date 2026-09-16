import { useMemo } from 'react'
import { CATEGORIES } from '../lib/constants'
import { CATEGORY_ICONS, IconPin, IconClock, IconAge } from './icons'

function CurationCard({ place, onSelectPlace, onOpenDetail }) {
  const catKey = place.category
  const cat = CATEGORIES.find((c) => c.key === catKey) || CATEGORIES[0]
  const Icon = CATEGORY_ICONS[catKey]

  return (
    <div
      className="curation-card"
      onClick={() => {
        if (onSelectPlace) onSelectPlace(place.id)
        if (onOpenDetail) onOpenDetail(place)
      }}
    >
      <div className="curation-thumb-box">
        {place.image_url ? (
          <img src={place.image_url} alt={place.name} className="curation-thumb-img" />
        ) : (
          <div className="curation-thumb-fallback" style={{ background: cat.bg, color: cat.ink }}>
            {Icon && <Icon className="fallback-icon" />}
          </div>
        )}
        <span className="curation-cat-badge" style={{ background: cat.bg, color: cat.ink }}>
          {cat.label}
        </span>
        <button
          type="button"
          className="curation-bookmark-btn"
          title="상세보기"
          onClick={(e) => {
            e.stopPropagation()
            if (onOpenDetail) onOpenDetail(place)
          }}
        >
          🔍
        </button>
      </div>

      <div className="curation-card-body">
        <h4 className="curation-title">{place.name}</h4>
        <p className="curation-desc">{place.description || place.summary || '아이와 함께 방문하기 좋은 곳'}</p>

        <div className="curation-meta-row">
          <span className="curation-meta-pill">
            <IconPin className="icon" />
            {place.region || '분당'}
          </span>
          {place.age_range && (
            <span className="curation-meta-pill age-pill">
              <IconAge className="icon" />
              {place.age_range}
            </span>
          )}
          {place.duration_min && (
            <span className="curation-meta-pill time-pill">
              <IconClock className="icon" />
              {place.duration_min}분 체류
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HomeCurationView({
  places = [],
  searchQuery = '',
  onResetSearch,
  onSelectPlace,
  onOpenDetail,
  onSwitchToMap,
}) {
  // 카테고리별로 장소 그룹핑
  const categorized = useMemo(() => {
    const map = {}
    CATEGORIES.forEach((c) => {
      map[c.key] = places.filter((p) => p.category === c.key)
    })
    return map
  }, [places])

  const sectionTitles = {
    나들이장소: {
      title: '🏛️ 아이와 함께 떠나는 나들이 & 박물관',
      sub: '유익한 체험과 자연을 만나는 분당·경기남부 시그니처 나들이 코스',
    },
    놀이공간: {
      title: '🎈 신나는 키즈카페 & 대형 테마파크',
      sub: '아이들의 에너지 발산! 다양하고 안전한 실내/외 놀이 공간',
    },
    '식당/카페': {
      title: '☕ 부모님도 편하게 쉬는 아이동반 식당 & 카페',
      sub: '키즈 전용 공간과 파스타, 베이커리가 있는 감성 휴식 공간',
    },
    원데이클래스: {
      title: '🎨 아이 감성 쑥쑥! 원데이 클래스 & 도예 체험',
      sub: '손으로 조물조물 만드는 창의력 만점 소수정예 체험 프로그램',
    },
  }

  const hasAnyPlaces = places.length > 0

  return (
    <div className="home-curation-view">
      {!hasAnyPlaces ? (
        <div className="curation-empty-state">
          <div className="empty-icon-badge">🔍</div>
          <h3>'{searchQuery || '선택한 조건'}'에 대한 검색 결과가 없습니다</h3>
          <p>입력하신 검색어나 선택하신 필터 조건에 부합하는 장소를 찾지 못했어요.<br />다른 검색어를 입력하시거나 아래 버튼을 눌러 초기화해 보세요.</p>
          {onResetSearch && (
            <button type="button" className="btn-reset-search" onClick={onResetSearch}>
              🔄 검색어 및 필터 초기화
            </button>
          )}
        </div>
      ) : (
        CATEGORIES.map((c) => {
          const groupPlaces = categorized[c.key] || []
          if (groupPlaces.length === 0) return null
          const meta = sectionTitles[c.key] || { title: c.label, sub: '' }

          return (
            <section key={c.key} className="curation-section">
              <div className="section-head-row">
                <div className="head-text-group">
                  <h3>{meta.title}</h3>
                  <p className="section-sub">{meta.sub}</p>
                </div>
                <button
                  type="button"
                  className="section-more-btn"
                  onClick={() => onSwitchToMap && onSwitchToMap(c.key)}
                >
                  지도에서 전체보기 ➔
                </button>
              </div>

              <div className="curation-grid">
                {groupPlaces.map((p) => (
                  <CurationCard
                    key={p.id}
                    place={p}
                    onSelectPlace={onSelectPlace}
                    onOpenDetail={onOpenDetail}
                  />
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
