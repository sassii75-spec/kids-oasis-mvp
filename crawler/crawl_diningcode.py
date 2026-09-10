"""
Stage 1 샘플 크롤러 #2 — 다이닝코드 (리뷰/평판 데이터 소스)

대상: "분당구 키즈카페" 검색 결과 페이지
방식: 다이닝코드 리스트 페이지는 목록 자체가 자바스크립트로 렌더링되어
      정적 HTML 파싱만으로는 개별 카드 상세(주소 등)를 얻기 어렵다.
      대신 <meta name="description"> 태그에 상위 업체명 · 카테고리 · 평점이
      요약되어 노출되므로, 이를 정규식으로 파싱해 "가벼운 크로스체크용"
      리스트를 만든다. 주소 등 상세 정보는 data_quality: "partial" 로
      표시해 두고, 정식 연동 단계에서 제휴/정식 API로 보강한다.

주의: crawl_yugacrew.py 와 동일하게, 이 샌드박스에서는 diningcode.com 으로의
      아웃바운드 요청이 조직 네트워크 정책으로 차단되어 있어 직접 실행해보지
      못했다. 인터넷이 열려 있는 환경에서 실행할 것.

실행:
  pip install -r requirements.txt
  python crawl_diningcode.py
"""
import json
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import quote

import requests

QUERY = "분당구 키즈카페"
SOURCE_NAME = "다이닝코드"
SOURCE_URL = f"https://www.diningcode.com/list.dc?query={quote(QUERY)}"
OUTPUT_PATH = Path(__file__).parent / "output" / "places.diningcode.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; BundangOutingBot/0.1; +https://example.com/bot)"
}

# 메타 설명 예시: "분당구 키즈카페 맛집 판교몽 (카페 ★4.0), 벙커키즈 (키즈카페 ★1.0), 퐁퐁플라워 (키즈카페) 등 7곳의 전체 순위..."
ENTRY_PATTERN = re.compile(r"([가-힣A-Za-z0-9&\s]+?)\s*\(([^★)]+)(?:\s*★\s*([\d.]+))?\)")


def fetch_meta_description(url: str) -> str:
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', resp.text)
    return m.group(1) if m else ""


def extract_places(meta_desc: str):
    places = []
    for idx, m in enumerate(ENTRY_PATTERN.finditer(meta_desc), start=1):
        name = m.group(1).strip(" ,")
        category_raw = m.group(2).strip()
        rating = float(m.group(3)) if m.group(3) else None
        if not name:
            continue
        category = "놀이공간" if "키즈카페" in category_raw else "식당/카페"
        places.append(
            {
                "id": f"dc-{idx:03d}",
                "name": name,
                "category": category,
                "subcategory": category_raw,
                "address": None,
                "region": "분당구",
                "age_range": None,
                "hours": None,
                "price": None,
                "duration_min": 90 if category == "놀이공간" else 60,
                "description": f"다이닝코드 '{QUERY}' 검색 결과 노출 업체",
                "rating": rating,
                "source_name": SOURCE_NAME,
                "source_url": SOURCE_URL,
                "data_quality": "partial",
            }
        )
    return places


def main():
    try:
        meta_desc = fetch_meta_description(SOURCE_URL)
    except requests.RequestException as e:
        print(f"[오류] {SOURCE_URL} 요청 실패: {e}", file=sys.stderr)
        sys.exit(1)

    if not meta_desc:
        print("[경고] meta description을 찾지 못했습니다 — 페이지 구조 변경 여부 확인 필요", file=sys.stderr)

    places = extract_places(meta_desc)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(
            {"generated_at": str(date.today()), "source": SOURCE_NAME, "places": places},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"{len(places)}곳 추출 완료 → {OUTPUT_PATH}")
    print("※ 주소 등 상세 정보는 partial 상태 — 정식 연동 시 제휴/직접 확인으로 보강 필요")


if __name__ == "__main__":
    main()
