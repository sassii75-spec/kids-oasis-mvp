// 카카오맵 services 라이브러리의 Geocoder로 주소 -> 좌표를 변환한다.
// 서버 없이 클라이언트에서 바로 지오코딩할 수 있어 REST API 키 없이 JS 키만으로 동작한다.

let geocoder = null

function getGeocoder(kakao) {
  if (!geocoder) geocoder = new kakao.maps.services.Geocoder()
  return geocoder
}

export function geocodeAddress(kakao, address) {
  return new Promise((resolve) => {
    if (!address) {
      resolve(null)
      return
    }
    const g = getGeocoder(kakao)
    g.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        resolve({ lat: Number(result[0].y), lng: Number(result[0].x) })
      } else {
        resolve(null)
      }
    })
  })
}

// 여러 장소를 순차 지오코딩 (카카오 API 호출량을 과도하게 몰아쓰지 않도록 약간의 지연을 둔다)
export async function geocodePlaces(kakao, places, { delayMs = 60 } = {}) {
  const results = {}
  for (const place of places) {
    if (!place.address) continue
    // eslint-disable-next-line no-await-in-loop
    const coord = await geocodeAddress(kakao, place.address)
    if (coord) results[place.id] = coord
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, delayMs))
  }
  return results
}
