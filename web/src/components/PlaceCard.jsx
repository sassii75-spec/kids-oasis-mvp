import { CATEGORY_MAP } from '../lib/constants'
import { CATEGORY_ICONS, IconClock, IconAge, IconPrice, IconGift } from './icons'

export default function PlaceCard({ place, selected, onSelect, onOpenDetail }) {
  const cat = CATEGORY_MAP[place.category]
  const Icon = CATEGORY_ICONS[place.category]

  return (
    <div
      className="place-card"
      data-selected={selected}
      onClick={() => {
        onSelect(place.id)
        if (onOpenDetail) onOpenDetail(place)
      }}
    >
      <div className="thumb-wrapper">
        {place.image_url ? (
          <img src={place.image_url} alt={place.name} className="thumb-img" />
        ) : (
          cat && Icon && (
            <div className="thumb-icon-box" style={{ background: cat.bg, color: cat.ink }}>
              <Icon className="icon" />
            </div>
          )
        )}
        {place.oasis_pass_benefit && (
          <span className="oasis-pass-badge">
            <IconGift className="icon" /> {place.oasis_pass_benefit}
          </span>
        )}
      </div>

      <div className="body">
        <div className="row1">
          <h4>{place.name}</h4>
          <button
            type="button"
            className="detail-badge-btn"
            onClick={(e) => {
              e.stopPropagation()
              if (onOpenDetail) onOpenDetail(place)
            }}
          >
            상세 팝업
          </button>
        </div>

        <div className="tag-row">
          {cat && Icon && (
            <span className="cat-pill" style={{ background: cat.bg, color: cat.ink }}>
              <Icon className="icon" />
              {cat.label}
            </span>
          )}
          {place.subcategory && <span className="subcat-pill">#{place.subcategory}</span>}
        </div>

        <div className="care-tags-row">
          <span className="care-tag">🅿️ 넓은주차장</span>
          <span className="care-tag">👶 유모차가능</span>
          <span className="care-tag">🍼 수유실</span>
        </div>

        <div className="meta">
          <span><IconClock className="icon" />{place.duration_min ? `${place.duration_min}분` : '시간 미상'}</span>
          <span><IconAge className="icon" />{place.age_range || '연령 확인필요'}</span>
          {place.price && <span><IconPrice className="icon" />{place.price}</span>}
          {place.data_quality === 'partial' && <span className="quality-flag">정보 보강 필요</span>}
        </div>

        {place.description && <p className="desc">{place.description}</p>}
      </div>
    </div>
  )
}

