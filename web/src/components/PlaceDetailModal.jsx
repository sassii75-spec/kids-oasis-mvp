import { CATEGORY_MAP } from '../lib/constants'
import { CATEGORY_ICONS, IconClock, IconAge, IconPrice, IconPin, IconGift } from './icons'

export default function PlaceDetailModal({ place, onClose, onSelectOnMap }) {
  if (!place) return null

  const cat = CATEGORY_MAP[place.category]
  const CategoryIcon = CATEGORY_ICONS[place.category]

  const kakaoMapSearchUrl = `https://map.kakao.com/link/search/${encodeURIComponent(
    place.name
  )}`

  const benefitText = place.oasis_pass_benefit || '키즈오아시스 혜택: 현장 웰컴 체험키트 증정'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        {/* Modal Banner / Image */}
        <div className="modal-header-image">
          {place.image_url ? (
            <img src={place.image_url} alt={place.name} className="place-hero-img" />
          ) : (
            <div className="place-hero-fallback" style={{ background: cat?.bg, color: cat?.ink }}>
              {CategoryIcon && <CategoryIcon className="hero-icon" />}
            </div>
          )}
          <div className="modal-header-badge-row">
            {cat && (
              <span className="cat-pill" style={{ background: cat.bg, color: cat.ink }}>
                {CategoryIcon && <CategoryIcon className="icon" />}
                {cat.label}
              </span>
            )}
            {place.subcategory && <span className="subcat-pill">{place.subcategory}</span>}
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="title-row">
            <h2>{place.name}</h2>
            {place.data_quality === 'partial' && (
              <span className="quality-flag">정보 보강 필요</span>
            )}
          </div>

          <p className="summary-desc">{place.description}</p>

          {/* Kids Care Meta Tags */}
          <div className="modal-care-tags">
            <span className="care-badge">🅿️ 넓은 주차장 (초보가능)</span>
            <span className="care-badge">👶 유모차 가능</span>
            <span className="care-badge">🍼 수유실 완비</span>
            <span className="care-badge">☀️ 실내 체험</span>
          </div>

          {/* Oasis Pass Benefit Banner */}
          <div className="oasis-benefit-banner">
            <IconGift className="icon" />
            <span className="benefit-text">{benefitText}</span>
          </div>

          {/* Quick Meta Info Grid */}
          <div className="info-grid">
            <div className="info-item">
              <span className="label"><IconPin className="icon" /> 주소</span>
              <span className="val">{place.address || '주소 정보 확인 필요'}</span>
            </div>
            <div className="info-item">
              <span className="label"><IconClock className="icon" /> 이용시간 & 체류</span>
              <span className="val">{place.hours || '정보 확인필요'} ({place.duration_min}분 추천)</span>
            </div>
            <div className="info-item">
              <span className="label"><IconAge className="icon" /> 권장 연령</span>
              <span className="val">{place.age_range || '전 연령'}</span>
            </div>
            <div className="info-item">
              <span className="label"><IconPrice className="icon" /> 이용 요금</span>
              <span className="val">{place.price || '정보 확인필요'}</span>
            </div>
            {place.parking_info && (
              <div className="info-item full">
                <span className="label">🚗 주차 상세</span>
                <span className="val">{place.parking_info}</span>
              </div>
            )}
          </div>

          {/* Key Highlights */}
          {place.highlights && place.highlights.length > 0 && (
            <div className="section-box highlights-box">
              <h3>✨ 주요 체험 & 특징</h3>
              <ul>
                {place.highlights.map((item, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Parent Tips */}
          {place.parent_tips && (
            <div className="section-box tips-box">
              <h3>💡 아이랑 방문 꿀팁</h3>
              <p>{place.parent_tips}</p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          {place.coord && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onSelectOnMap(place.id)
                onClose()
              }}
            >
              코스에 추가하기
            </button>
          )}
          <a
            href={kakaoMapSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            후기 보기 (4.8 ★)
          </a>
        </div>
      </div>
    </div>
  )
}

