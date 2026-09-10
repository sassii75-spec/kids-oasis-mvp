// 장소 카테고리 정의 — 기획서 §2.2 MVP 범위와 동일한 4개 카테고리
// 색상은 '키즈오아시스 화면 시안'(파스텔톤 디자인 캔버스)과 동일한 oklch 팔레트를 사용한다.
export const CATEGORIES = [
  { key: '나들이장소', label: '나들이 장소', bg: 'oklch(0.90 0.06 155)', ink: 'oklch(0.42 0.09 155)' },
  { key: '놀이공간', label: '놀이 공간', bg: 'oklch(0.90 0.065 25)', ink: 'oklch(0.48 0.13 25)' },
  { key: '식당/카페', label: '식당·카페', bg: 'oklch(0.91 0.075 85)', ink: 'oklch(0.47 0.10 75)' },
  { key: '원데이클래스', label: '원데이 클래스', bg: 'oklch(0.90 0.045 290)', ink: 'oklch(0.46 0.10 290)' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]))

// 코스 조합 시 "체험/활동"으로 취급할 카테고리 vs "휴식"으로 취급할 카테고리
export const ACTIVITY_CATEGORIES = ['나들이장소', '놀이공간', '원데이클래스']
export const REST_CATEGORIES = ['식당/카페']

export const AGE_OPTIONS = ['전체', '영아(0~2세)', '유아(3~5세)', '유치원~초등저학년(6~9세)']

// 키즈 안심 케어 태그 목록
export const KIDS_CARE_TAGS = [
  { key: 'parking', label: '넓은 주차장 (초보가능)', icon: '🅿️' },
  { key: 'stroller', label: '유모차 가능', icon: '👶' },
  { key: 'nursing', label: '수유실 완비', icon: '🍼' },
  { key: 'indoor', label: '실내 체험', icon: '☀️' },
]

// 분당구청 부근 — 지도 기본 중심 좌표 (place 좌표를 아직 못 구했을 때의 폴백)
export const DEFAULT_CENTER = { lat: 37.3826, lng: 127.1188 }

