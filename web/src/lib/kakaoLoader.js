// 카카오맵 JS SDK를 동적으로 로드한다. autoload=false 로 불러온 뒤
// kakao.maps.load(callback) 로 초기화 시점을 직접 제어하는 공식 권장 패턴을 사용한다.
// 참고: https://apis.map.kakao.com/web/guide/

let loadingPromise = null

export function loadKakaoMaps() {
  if (window.kakao && window.kakao.maps) {
    return Promise.resolve(window.kakao)
  }
  if (loadingPromise) return loadingPromise

  const appKey = import.meta.env.VITE_KAKAO_JS_KEY

  loadingPromise = new Promise((resolve, reject) => {
    if (!appKey || appKey.includes('여기에')) {
      reject(
        new Error(
          'VITE_KAKAO_JS_KEY가 설정되지 않았습니다. web/.env 파일에 카카오 JavaScript 키를 넣어주세요.'
        )
      )
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`
    script.async = true
    script.onerror = () => reject(new Error('카카오맵 SDK 스크립트를 불러오지 못했습니다.'))
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao))
    }
    document.head.appendChild(script)
  })

  return loadingPromise
}
