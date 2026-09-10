import { IconLogo, IconSparkle, IconGift, IconPin } from './icons'

export default function AboutModal({ onClose, onStartRecommend }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container about-modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        {/* Hero Header */}
        <div className="about-modal-hero">
          <div className="about-hero-logo">
            <IconLogo className="hero-logo-icon" />
          </div>
          <h2>키즈오아시스 (Kids Oasis)란?</h2>
          <p className="about-tagline">
            아이와 함께하는 주말, 코스 고민 없는 <strong>맞춤 나들이 오아시스</strong>
          </p>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="about-values-grid">
          <div className="about-value-card">
            <div className="value-icon-box box-green">📍</div>
            <h3>1초 맞춤 코스 조합</h3>
            <p>
              현재 위치에서 출발하여 <strong>나들이 ➔ 키즈 프렌들리 식당 ➔ 체험/놀이공간</strong>까지 이동 시간과 체류 시간을 계산해 1초 만에 최적 동선을 만들어드려요.
            </p>
          </div>

          <div className="about-value-card">
            <div className="value-icon-box box-blue">🍼</div>
            <h3>초보맘 3대 안심 데이터</h3>
            <p>
              블로그 검색 없이 <strong>넓은 주차장(초보가능), 유모차 무장애(Barrier-Free), 수유실 및 아기의자 유무</strong>를 100% 검증하여 보여드려요.
            </p>
          </div>

          <div className="about-value-card">
            <div className="value-icon-box box-orange">🎁</div>
            <h3>오아시스 키즈 패스</h3>
            <p>
              키즈오아시스 추천 코스로 방문 시 제휴 매장에서 <strong>웰컴 아이 음료, 체험 키트 증정, 할인 혜택</strong>을 단독으로 누리실 수 있어요.
            </p>
          </div>
        </div>

        {/* Key Impact Stats Badges */}
        <div className="about-stats-row">
          <div className="stat-badge-item">
            <IconPin className="icon" />
            <span>분당·판교 큐레이션 12+</span>
          </div>
          <div className="stat-badge-item">
            <IconSparkle className="icon" />
            <span>계획 시간 90% 단축</span>
          </div>
          <div className="stat-badge-item">
            <IconGift className="icon" />
            <span>🌧️ 비 오는 날 1초 실내 전환</span>
          </div>
        </div>

        {/* Modal Action CTA */}
        <div className="about-modal-footer">
          <button
            type="button"
            className="btn-start-recommend"
            onClick={() => {
              onClose()
              if (onStartRecommend) onStartRecommend()
            }}
          >
            <IconSparkle className="icon" />
            지금 맞춤 코스 추천받기
          </button>
        </div>
      </div>
    </div>
  )
}
