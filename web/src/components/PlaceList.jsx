import PlaceCard from './PlaceCard'

export default function PlaceList({ places, selectedId, searchQuery, onResetSearch, onSelect, onOpenDetail }) {
  if (places.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
        <div>{searchQuery ? `'${searchQuery}'에 대한 검색 결과가 없어요.` : '조건에 맞는 장소가 없어요. 필터를 조정해보세요.'}</div>
        {onResetSearch && searchQuery && (
          <button
            type="button"
            className="btn-reset-search"
            style={{
              marginTop: 12,
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
            }}
            onClick={onResetSearch}
          >
            🔄 검색어 초기화
          </button>
        )}
      </div>
    )
  }
  return (
    <>
      {places.map((p) => (
        <PlaceCard
          key={p.id}
          place={p}
          selected={p.id === selectedId}
          onSelect={onSelect}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </>
  )
}
