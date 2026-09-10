import PlaceCard from './PlaceCard'

export default function PlaceList({ places, selectedId, onSelect, onOpenDetail }) {
  if (places.length === 0) {
    return <div className="empty-state">조건에 맞는 장소가 없어요. 필터를 조정해보세요.</div>
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
