"""
Stage 1 샘플 크롤러 #1 — 유가크루 크루레터 (나들이 장소 큐레이션 매체)

대상: 성남/분당/판교 아이랑 가볼만한곳 아티클 1건
방식: 기사 본문의 소제목(장소명)과 그 아래 본문 텍스트를 추출해
      places.json 스키마에 맞게 정규화한다.

주의:
  이 저장소를 개발한 샌드박스 환경은 조직 정책상 외부 사이트로의 아웃바운드
  네트워크가 npm 레지스트리 등 허용 목록으로 제한되어 있어, 이 스크립트를
  샌드박스 안에서 직접 실행하지는 못했다. 대신 동일한 URL을 1회 조회하여
  얻은 결과를 crawler/output/places.json 에 시드 데이터로 넣어두었다.
  이 스크립트는 인터넷 접근이 자유로운 개발자의 로컬 환경/서버에서
  실행하도록 작성되어 있으며, 실제 페이지 구조가 바뀌었을 수 있으니
  브라우저 개발자도구로 셀렉터를 먼저 확인한 뒤 사용을 권장한다.

실행:
  pip install -r requirements.txt
  python crawl_yugacrew.py
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

import requests
from bs4 import BeautifulSoup

SOURCE_NAME = "유가크루 크루레터"
SOURCE_URL = "https://www.yugacrew.com/crewletter/best-places-for-kids-bundang-pangyo"
OUTPUT_PATH = Path(__file__).parent / "output" / "places.yugacrew.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; BundangOutingBot/0.1; +https://example.com/bot)"
}

# 본문에서 "장소명 뒤 괄호/화살표로 이어지는 짧은 설명" 패턴을 최대한 넓게 잡기 위한
# 휴리스틱. 실제 마크업은 h2/h3/strong 등 사이트마다 다르므로, 아래 SELECTORS 중
# 페이지에 존재하는 첫 번째 것을 사용한다. 필요시 devtools로 확인 후 조정할 것.
HEADING_SELECTORS = ["article h2", "article h3", ".post-content h2", ".post-content h3", "h2", "h3"]


def fetch(url: str) -> BeautifulSoup:
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")


def extract_places(soup: BeautifulSoup):
    places = []
    headings = []
    for sel in HEADING_SELECTORS:
        headings = soup.select(sel)
        if headings:
            break

    for idx, h in enumerate(headings, start=1):
        raw_title = h.get_text(strip=True)
        # 번호/이모지 등 접두어 제거 (예: "1. 판교박물관" -> "판교박물관")
        name = re.sub(r"^[\d\.\)\s]+", "", raw_title).strip()
        if not name:
            continue

        # 다음 형제 요소들에서 본문 텍스트를 모아 설명으로 사용
        desc_parts = []
        for sib in h.find_next_siblings():
            if sib.name in ("h2", "h3"):
                break
            text = sib.get_text(" ", strip=True)
            if text:
                desc_parts.append(text)
            if len(" ".join(desc_parts)) > 300:
                break
        description = " ".join(desc_parts)[:300]

        places.append(
            {
                "id": f"yc-{idx:03d}",
                "name": name,
                "category": None,  # 카테고리 자동 분류는 normalize.py 에서 키워드 매칭으로 보강
                "address": None,
                "region": None,
                "age_range": None,
                "hours": None,
                "price": None,
                "duration_min": None,
                "description": description,
                "source_name": SOURCE_NAME,
                "source_url": SOURCE_URL,
                "data_quality": "raw",  # normalize 단계 이전 원본 표시
            }
        )
    return places


def main():
    try:
        soup = fetch(SOURCE_URL)
    except requests.RequestException as e:
        print(f"[오류] {SOURCE_URL} 요청 실패: {e}", file=sys.stderr)
        print("네트워크 접근이 가능한 환경에서 다시 시도하세요.", file=sys.stderr)
        sys.exit(1)

    places = extract_places(soup)
    if not places:
        print("[경고] 추출된 장소가 없습니다 — 페이지 구조가 바뀌었을 수 있습니다. "
              "HEADING_SELECTORS 를 devtools로 확인해 수정하세요.", file=sys.stderr)

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


if __name__ == "__main__":
    main()
