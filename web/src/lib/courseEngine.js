// Stage 3 — 규칙 기반 맞춤 코스 추천 엔진
import { ACTIVITY_CATEGORIES, REST_CATEGORIES } from './constants'

const AVG_SPEED_KMH = 25 // 분당 도심 기준 평균 이동 속도 가정
const MIN_TRAVEL_MIN = 8

function haversineKm(a, b) {
  if (!a || !b || a.lat == null || b.lat == null) return 0
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function travelMinutes(a, b) {
  const km = haversineKm(a, b)
  return Math.max(MIN_TRAVEL_MIN, Math.round((km / AVG_SPEED_KMH) * 60))
}

function fmtTime(startMinutesOfDay, offset) {
  const total = startMinutesOfDay + offset
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function estimateCourseCost(steps) {
  let minCost = 0
  let maxCost = 0

  for (const s of steps) {
    const p = s.place
    const priceStr = p.price || ''
    if (priceStr.includes('무료')) {
      // 0원
    } else if (p.category === '식당/카페') {
      minCost += 25000
      maxCost += 40000
    } else if (p.category === '놀이공간') {
      minCost += 20000
      maxCost += 35000
    } else if (p.category === '원데이클래스') {
      minCost += 25000
      maxCost += 45000
    } else {
      if (priceStr.includes('만') || priceStr.includes('000')) {
        minCost += 10000
        maxCost += 20000
      } else {
        minCost += 5000
        maxCost += 12000
      }
    }
  }

  if (maxCost === 0) return '무료'
  const minMan = Math.floor(minCost / 10000)
  const maxMan = Math.ceil(maxCost / 10000)
  if (minMan === 0) return `약 ${maxMan}만원 이내`
  return `약 ${minMan}~${maxMan}만원대`
}

/**
 * @param {Array} places 장소 목록 배열 [{...place, coord:{lat,lng}}]
 * @param {Object} opts
 *   startMinutes: 코스 시작 시각(자정 기준 분)
 *   windowMinutes: 총 소요 시간(분)
 *   userCoord: { lat, lng } 사용자 출발 위치
 *   startLocationName: '현재 위치 (분당구 정자동)' 등
 *   count: 생성할 코스 선택지 수 (기본 3개)
 */
export function buildCourses(places, opts = {}) {
  const {
    startMinutes = 600,
    windowMinutes = 240,
    userCoord,
    startLocationName,
    count = 3,
  } = opts

  // 1. 유효한 좌표를 가진 장소만 필터링
  let pool = places.filter((p) => p && p.coord)

  // 좌표가 일부 없는 경우 정자동 기본 좌표 부여하여 오류 방지
  if (pool.length === 0 && places && places.length > 0) {
    pool = places.map((p, idx) => ({
      ...p,
      coord: p.coord || { lat: 37.3614 + idx * 0.003, lng: 127.1114 + idx * 0.003 },
    }))
  }

  if (pool.length === 0) return []

  const originCoord = userCoord || { lat: 37.3614, lng: 127.1114 }

  // 출발지와 근접한 순으로 장소 정렬
  const poolWithDist = pool
    .map((p) => ({
      place: p,
      distKm: haversineKm(originCoord, p.coord),
    }))
    .sort((a, b) => a.distKm - b.distKm)

  const sortedPlaces = poolWithDist.map((pd) => pd.place)

  const rawCourses = []

  // 다양한 시작점을 가진 코스 후보군 조합 생성
  for (let i = 0; i < Math.min(sortedPlaces.length, 6); i++) {
    const primary = sortedPlaces[i]
    const initialTravel = travelMinutes(originCoord, primary.coord)
    const initialDist = haversineKm(originCoord, primary.coord)
    const primaryDuration = primary.duration_min || 60

    const steps = [
      {
        place: primary,
        arriveOffset: initialTravel,
        durationMin: primaryDuration,
        travelMinFromPrev: initialTravel,
        distanceKmFromPrev: Math.round(initialDist * 10) / 10,
      },
    ]

    let cursorOffset = initialTravel + primaryDuration
    let cursorPlace = primary
    let totalDistance = initialDist
    let remaining = Math.max(30, windowMinutes - cursorOffset)

    // 소요시간 창에 따른 목표 스탑 수 (3~5개)
    const maxStops = windowMinutes >= 480 ? 5 : windowMinutes >= 360 ? 4 : 3

    while (steps.length < maxStops && remaining >= 15) {
      // 다음 방문할 후속 후보 장소 (이미 포함된 장소 제외)
      const isRestTurn = steps.length % 2 === 1
      let candidates = sortedPlaces.filter(
        (item) => !steps.some((s) => s.place.id === item.id)
      )

      if (candidates.length === 0) break

      // 활동/휴식 교차 선호 정렬
      const preferred = candidates.filter((item) =>
        isRestTurn
          ? REST_CATEGORIES.includes(item.category)
          : ACTIVITY_CATEGORIES.includes(item.category)
      )

      const targetPool = preferred.length > 0 ? preferred : candidates

      // 현재 스탑과 가장 가까운 장소 선택
      const sortedCandidates = targetPool
        .map((item) => ({
          place: item,
          distanceKm: haversineKm(cursorPlace.coord, item.coord),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)

      const pick = sortedCandidates[0]
      const travel = travelMinutes(cursorPlace.coord, pick.place.coord)
      const dur = pick.place.duration_min || 60

      cursorOffset += travel
      steps.push({
        place: pick.place,
        arriveOffset: cursorOffset,
        durationMin: dur,
        travelMinFromPrev: travel,
        distanceKmFromPrev: Math.round(pick.distanceKm * 10) / 10,
      })
      cursorOffset += dur
      remaining -= travel + dur
      totalDistance += pick.distanceKm
      cursorPlace = pick.place
    }

    rawCourses.push({
      id: `course-${primary.id}-${i}`,
      startLocation: originCoord,
      startLocationName: startLocationName || '현재 위치',
      steps,
      totalMinutes: cursorOffset,
      totalDistanceKm: Math.round(totalDistance * 10) / 10,
      estimatedCostText: estimateCourseCost(steps),
      startMinutes,
    })

    if (rawCourses.length >= count * 2) break
  }

  // 최종 count개 (3개) 옵션 포맷팅
  const finalCourses = rawCourses.slice(0, count).map((c, idx) => ({
    ...c,
    id: `course-opt-${idx + 1}`,
    steps: c.steps.map((s) => ({
      ...s,
      startLabel: fmtTime(c.startMinutes, s.arriveOffset),
      endLabel: fmtTime(c.startMinutes, s.arriveOffset + s.durationMin),
    })),
    startLabel: fmtTime(c.startMinutes, 0),
    endLabel: fmtTime(c.startMinutes, c.totalMinutes),
  }))

  return finalCourses
}
