// 시안(키즈오아시스 화면 시안)과 동일한 스타일의 인라인 SVG 아이콘 세트.
// 이모지 대신 선 굵기 1.8의 스트로크 아이콘으로 통일한다.
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconLogo(props) {
  return (
    <svg width="38" height="34" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Sprout Stem */}
      <path d="M18 36C18 36 20 22 22 14" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" />
      {/* Left Leaf */}
      <path d="M20 20C14 18 8 20 6 25C12 27 18 24 20 20Z" fill="#10B981" />
      {/* Right Leaf */}
      <path d="M21 16C27 12 34 13 37 18C31 21 24 19 21 16Z" fill="#059669" />
      {/* Small Top Yellow Flower / Bud */}
      <circle cx="23" cy="11" r="4.5" fill="#FBBF24" />
      <circle cx="23" cy="11" r="2" fill="#F59E0B" />
    </svg>
  )
}

export function IconRain(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 13a4 4 0 0 0-7.8-1.2A3.5 3.5 0 0 0 5 15.5 3.5 3.5 0 0 0 8.5 19h8a3.5 3.5 0 0 0 .5-7z" />
      <path d="M8 21v1M12 21v1M16 21v1" />
    </svg>
  )
}

export function IconGift(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12v10H4V12" />
      <path d="M22 7H2v5h20V7z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  )
}

export function IconSearch(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export function IconUser(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="7" r="4" />
      <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
    </svg>
  )
}

export function IconOuting(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21h16" />
      <path d="M5 21V10l7-6 7 6v11" />
      <path d="M9 21v-6h6v6" />
    </svg>
  )
}

export function IconPlay(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  )
}

export function IconCafe(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z" />
      <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 3c0 1-1 1-1 2M12 3c0 1-1 1-1 2" />
    </svg>
  )
}

export function IconClass(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 15c0-5 3.5-9.5 9-10 4 0 7 3 7 6.5S17 18 12 18c-1 0-2-.2-2.8-.5" />
      <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M5 19l2.5-2.5" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  )
}

export function IconAge(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-4 3-6.8 7-6.8s7 2.8 7 6.8" />
    </svg>
  )
}

export function IconPrice(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12l8-8h8v8l-8 8-8-8z" />
      <circle cx="15" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconPin(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-7-6.5-7-11a7 7 0 1 1 14 0c0 4.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

export function IconChevronRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function IconSparkle(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
    </svg>
  )
}

export const CATEGORY_ICONS = {
  나들이장소: IconOuting,
  놀이공간: IconPlay,
  '식당/카페': IconCafe,
  원데이클래스: IconClass,
}

