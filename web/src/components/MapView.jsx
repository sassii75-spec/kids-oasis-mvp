import { useEffect, useRef } from 'react'
import { DEFAULT_CENTER } from '../lib/constants'

// 카테고리별 커스텀 핀 테마 (아이콘, 배경색, 텍스트색, 테두리색)
const CATEGORY_PIN_THEMES = {
  나들이장소: {
    icon: '🏛️',
    bg: '#ECFDF5',
    ink: '#065F46',
    border: '#10B981',
    badgeBg: '#10B981',
  },
  놀이공간: {
    icon: '🎈',
    bg: '#FFF1F2',
    ink: '#9F1239',
    border: '#F43F5E',
    badgeBg: '#F43F5E',
  },
  '식당/카페': {
    icon: '☕',
    bg: '#FEF3C7',
    ink: '#92400E',
    border: '#F59E0B',
    badgeBg: '#F59E0B',
  },
  원데이클래스: {
    icon: '🎨',
    bg: '#F0F9FF',
    ink: '#075985',
    border: '#0EA5E9',
    badgeBg: '#0EA5E9',
  },
}

export default function MapView({
  kakao,
  kakaoError,
  places,
  selectedId,
  onSelectPlace,
  onOpenDetail,
  selectedCourse,
  userLocation,
}) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const overlaysRef = useRef([])
  const polylineRef = useRef(null)
  const distanceOverlaysRef = useRef([])
  const infoWindowRef = useRef(null)

  const activeCoord = userLocation?.coord || DEFAULT_CENTER

  // 지도 최초 생성
  useEffect(() => {
    if (!kakao || !mapRef.current || mapInstance.current) return
    mapInstance.current = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(activeCoord.lat, activeCoord.lng),
      level: 5, // 분당/판교 중심 가독성을 위해 적절한 줌 레벨로 고정
    })
    infoWindowRef.current = new kakao.maps.InfoWindow({ removable: true })
  }, [kakao, activeCoord.lat, activeCoord.lng])

  // 현재 위치로 지도 바로 이동하는 핸들러
  const handleRecenter = () => {
    if (!mapInstance.current || !kakao) return
    const latLng = new kakao.maps.LatLng(activeCoord.lat, activeCoord.lng)
    mapInstance.current.setCenter(latLng)
    mapInstance.current.setLevel(5)
  }

  // 커스텀 핀 및 경로선(Polyline) 갱신
  useEffect(() => {
    if (!kakao || !mapInstance.current) return

    // 기존 커스텀 핀 및 경로선 삭제
    overlaysRef.current.forEach((o) => o.setMap(null))
    overlaysRef.current = []

    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }

    distanceOverlaysRef.current.forEach((o) => o.setMap(null))
    distanceOverlaysRef.current = []

    // 0. 현재 위치 (분당/판교) 고정 핀 생성
    const userLatLng = new kakao.maps.LatLng(activeCoord.lat, activeCoord.lng)
    const userContent = document.createElement('div')
    userContent.className = 'custom-map-pin is-user-pin'
    userContent.innerHTML = `
      <div class="pin-card user-location-card" style="background:#EC4899; border-color:#BE185D; color:#FFFFFF; font-weight:800; box-shadow: 0 4px 12px rgba(236,72,153,0.35);">
        <span class="pin-icon">📍</span>
        <span class="pin-title">${userLocation?.addressName || '현재 위치 (분당구 정자동)'}</span>
      </div>
      <div class="pin-tail" style="border-top-color:#BE185D"></div>
    `
    const userOverlay = new kakao.maps.CustomOverlay({
      position: userLatLng,
      content: userContent,
      yAnchor: 1.25,
      zIndex: 25,
    })
    userOverlay.setMap(mapInstance.current)
    overlaysRef.current.push(userOverlay)

    // 선택된 코스가 있을 경우, 코스 스탑 순서 맵핑 (id -> 순서 1, 2, 3...)
    const stepOrderMap = {}
    if (selectedCourse && selectedCourse.steps) {
      selectedCourse.steps.forEach((step, idx) => {
        stepOrderMap[step.place.id] = idx + 1
      })
    }

    const withCoord = places.filter((p) => p.coord)

    // 1. 장소 커스텀 마커(CustomOverlay) 생성
    withCoord.forEach((place) => {
      const theme = CATEGORY_PIN_THEMES[place.category] || {
        icon: '📍',
        bg: '#F3F4F6',
        ink: '#1F2937',
        border: '#6B7280',
        badgeBg: '#6B7280',
      }

      const isSelected = place.id === selectedId
      const stepNum = stepOrderMap[place.id]

      const content = document.createElement('div')
      content.className = `custom-map-pin ${isSelected ? 'is-selected' : ''} ${
        stepNum ? 'is-course-step' : ''
      }`
      content.innerHTML = `
        <div class="pin-card" style="background:${theme.bg}; border-color:${theme.border}; color:${theme.ink};">
          ${
            stepNum
              ? `<span class="step-num-badge" style="background:${theme.badgeBg}">${stepNum}</span>`
              : ''
          }
          <span class="pin-icon">${theme.icon}</span>
          <span class="pin-title">${place.name}</span>
        </div>
        <div class="pin-tail" style="border-top-color:${theme.border}"></div>
      `

      content.addEventListener('click', (e) => {
        e.stopPropagation()
        onSelectPlace(place.id)
        if (onOpenDetail) onOpenDetail(place)
      })

      const position = new kakao.maps.LatLng(place.coord.lat, place.coord.lng)
      const overlay = new kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 1.25,
        zIndex: isSelected ? 10 : stepNum ? 5 : 1,
      })

      overlay.setMap(mapInstance.current)
      overlaysRef.current.push(overlay)
    })

    // 2. 동선(Route Polyline) 표현 (선택된 코스가 있을 때)
    if (selectedCourse && selectedCourse.steps && selectedCourse.steps.length > 0) {
      const coursePath = []

      // 출발지 (현재 위치) 마커 생성 및 경로 시작점 추가
      if (selectedCourse.startLocation) {
        const startLatLng = new kakao.maps.LatLng(
          selectedCourse.startLocation.lat,
          selectedCourse.startLocation.lng
        )
        coursePath.push(startLatLng)

        const startContent = document.createElement('div')
        startContent.className = 'custom-map-pin is-start-pin'
        startContent.innerHTML = `
          <div class="pin-card start-card" style="background:#2563EB; border-color:#1D4ED8; color:#FFFFFF;">
            <span class="pin-icon">🚩</span>
            <span class="pin-title">${selectedCourse.startLocationName || '현재 위치'}</span>
          </div>
          <div class="pin-tail" style="border-top-color:#1D4ED8"></div>
        `
        const startOverlay = new kakao.maps.CustomOverlay({
          position: startLatLng,
          content: startContent,
          yAnchor: 1.25,
          zIndex: 15,
        })
        startOverlay.setMap(mapInstance.current)
        overlaysRef.current.push(startOverlay)
      }

      // 각 장소 스탑 좌표 추가 및 이전 지점과의 이동 시간 뱃지 생성
      selectedCourse.steps.forEach((step) => {
        if (step.place.coord) {
          const latLng = new kakao.maps.LatLng(step.place.coord.lat, step.place.coord.lng)
          coursePath.push(latLng)

          // 이전 지점(출발지 또는 이전 스탑)과의 중간에 이동시간 뱃지 표시
          const pathLen = coursePath.length
          if (pathLen >= 2 && step.travelMinFromPrev) {
            const prevLatLng = coursePath[pathLen - 2]
            const midLat = (prevLatLng.getLat() + latLng.getLat()) / 2
            const midLng = (prevLatLng.getLng() + latLng.getLng()) / 2

            const distContent = document.createElement('div')
            distContent.className = 'route-midpoint-badge'
            distContent.innerHTML = `🚗 약 ${step.travelMinFromPrev}분 (${step.distanceKmFromPrev || ''}km)`

            const distOverlay = new kakao.maps.CustomOverlay({
              position: new kakao.maps.LatLng(midLat, midLng),
              content: distContent,
              yAnchor: 0.5,
              zIndex: 8,
            })
            distOverlay.setMap(mapInstance.current)
            distanceOverlaysRef.current.push(distOverlay)
          }
        }
      })

      // 이동 동선 폴리라인 그리기
      if (coursePath.length >= 2) {
        const polyline = new kakao.maps.Polyline({
          path: coursePath,
          strokeWeight: 6,
          strokeColor: '#2563EB', // 네비게이션 블루
          strokeOpacity: 0.85,
          strokeStyle: 'dashed',
        })
        polyline.setMap(mapInstance.current)
        polylineRef.current = polyline
      }

      // 코스 스탑 전용 영역으로 지도 바운드 맞추기
      const bounds = new kakao.maps.LatLngBounds()
      coursePath.forEach((pt) => bounds.extend(pt))
      mapInstance.current.setBounds(bounds)
    } else {
      // 일반 모드: 경기도 전체로 이탈하지 않고 고정으로 분당/판교 현재 위치 중심 유지
      mapInstance.current.setCenter(userLatLng)
      mapInstance.current.setLevel(5)
    }
  }, [kakao, places, selectedId, selectedCourse, onSelectPlace, onOpenDetail, activeCoord.lat, activeCoord.lng, userLocation?.addressName])

  // 목록에서 선택한 장소로 지도 이동
  useEffect(() => {
    if (!kakao || !mapInstance.current || !selectedId) return
    const place = places.find((p) => p.id === selectedId && p.coord)
    if (!place) return
    mapInstance.current.panTo(new kakao.maps.LatLng(place.coord.lat, place.coord.lng))
  }, [kakao, selectedId, places])

  const noAddressCount = places.filter((p) => !p.address).length

  return (
    <div className="map-pane" style={{ position: 'relative' }}>
      <div id="kakao-map" ref={mapRef} />
      
      {/* 🎯 현재 위치(분당·판교) 고정 버튼 */}
      {kakao && (
        <button
          type="button"
          className="map-recenter-btn"
          onClick={handleRecenter}
          title="현재 위치 (분당·판교)로 지도를 이동합니다"
        >
          🎯 분당·판교 위치 고정
        </button>
      )}

      {!kakao && !kakaoError && <div className="map-status">지도를 불러오는 중…</div>}
      {kakaoError && (
        <div className="map-status">
          카카오맵을 불러오지 못했어요.
          <code>{kakaoError}</code>
        </div>
      )}
      {kakao && noAddressCount > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 12,
            bottom: 12,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 12,
            color: 'var(--muted)',
            zIndex: 10,
          }}
        >
          주소 미확인 {noAddressCount}곳은 지도에 표시되지 않아요
        </div>
      )}
    </div>
  )
}
