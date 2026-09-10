"""
크롤러 출력물(raw)을 병합해 웹앱이 쓰는 최종 스키마(output/places.json)로 정규화한다.

실제 파이프라인에서는:
  1) crawl_yugacrew.py, crawl_diningcode.py (및 향후 추가되는 크롤러들)를 실행해
     output/places.<source>.json 을 생성하고
  2) 이 스크립트로 병합·정규화해 output/places.json 을 갱신한다.

이번 MVP 데모의 output/places.json 은 위 두 크롤러를 1회 수동 실행한 결과를
직접 정리해 시드로 넣어둔 상태이며, 이 스크립트는 앞으로 크롤러를 여러 개로
늘려갈 때 병합 로직의 뼈대로 쓰면 된다.
"""
import json
from datetime import date
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "output"
FINAL_PATH = OUTPUT_DIR / "places.json"

# 장소명/설명 키워드 -> 카테고리 매핑 (크롤러가 category=None으로 넘긴 raw 데이터 보강용)
CATEGORY_KEYWORDS = {
    "놀이공간": ["키즈카페", "테마파크", "놀이터", "플레이"],
    "식당/카페": ["카페", "식당", "레스토랑", "베이커리"],
    "원데이클래스": ["원데이", "클래스", "체험공방", "만들기"],
}
DEFAULT_CATEGORY = "나들이장소"


def guess_category(name: str, description: str) -> str:
    text = f"{name} {description}"
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(k in text for k in keywords):
            return category
    return DEFAULT_CATEGORY


def load_raw(path: Path):
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    return data.get("places", [])


def normalize(entry: dict) -> dict:
    if not entry.get("category"):
        entry["category"] = guess_category(entry.get("name", ""), entry.get("description", ""))
    if entry.get("data_quality") == "raw":
        # 필수 필드가 비어 있으면 partial 로 강등 (사람이 검수해야 함을 표시)
        required = ["address", "hours", "price", "age_range"]
        entry["data_quality"] = "partial" if any(not entry.get(k) for k in required) else "complete"
    return entry


def main():
    raw_files = sorted(OUTPUT_DIR.glob("places.*.json"))
    all_places = []
    for f in raw_files:
        all_places.extend(load_raw(f))

    if not all_places:
        print("병합할 raw 크롤러 출력이 없습니다. crawl_*.py 를 먼저 실행하세요.")
        print(f"(현재 {FINAL_PATH} 의 시드 데이터는 유지됩니다)")
        return

    normalized = [normalize(p) for p in all_places]
    FINAL_PATH.write_text(
        json.dumps(
            {"generated_at": str(date.today()), "schema_version": "0.1", "places": normalized},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"{len(normalized)}곳 정규화 완료 → {FINAL_PATH}")


if __name__ == "__main__":
    main()
