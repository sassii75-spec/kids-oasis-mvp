import { useState } from 'react'
import { IconPin, IconUser, IconGift, IconSparkle } from './icons'

const SAMPLE_POSTS = [
  {
    id: 'post-1',
    category: '나들이 생생 후기',
    title: '주말 판교박물관 다녀왔어요! 모래체험존 꿀팁과 주차 정보 공유 🏛️',
    author: '정자맘스',
    locationBadge: '📍 분당구 정자동 인증',
    kidInfo: '5세 딸 맘',
    date: '2시간 전',
    summary: '5세 아이와 주말 오전 판교박물관 방문했는데 주차장이 여유로워 쾌적했어요. 1층 탁본 체험키트는 안내데스크에서 꼭 먼저 받아가세요! 유모차 이동도 매우 수월합니다.',
    imageUrl: '/images/pangyo_museum.jpg',
    likes: 42,
    comments: 12,
    views: 380,
    tags: ['#판교박물관', '#실내체험', '#넓은주차장', '#수유실완비'],
    oasisPass: '🎁 오아시스 혜택: 무료 체험키트 수령',
  },
  {
    id: 'post-2',
    category: '키즈 프렌들리 맛집',
    title: '아기의자 있고 유모차 진입 쉬운 판교 파미어스몰 맛집 BEST 3 🍕',
    author: '판교아빠',
    locationBadge: '📍 분당구 삼평동 인증',
    kidInfo: '3세 아들 아빠',
    date: '5시간 전',
    summary: '아이 떼쓸 때 유모차 끌고 가기 제일 좋은 파미어스몰 내부 이탈리안 식당입니다. 키즈 웰컴 음료 서비스도 제공해주시고 아기의자가 10개 이상 구비되어 있어 부담 없네요.',
    imageUrl: '/images/turtle_cafe.jpg',
    likes: 89,
    comments: 24,
    views: 850,
    tags: ['#키즈프렌들리', '#아기의자', '#유모차진입', '#아이음료무료'],
    oasisPass: '🎁 오아시스 혜택: 아이 음료 무료',
  },
  {
    id: 'post-3',
    category: '주차/유모차 꿀팁',
    title: '비 오는 날 아이 피로도 최소화하는 분당 100% 실내 나들이 동선 🌧️',
    author: '분당쌍둥이맘',
    locationBadge: '📍 분당구 서현동 인증',
    kidInfo: '6세 쌍둥이 맘',
    date: '어제',
    summary: '갑자기 비 올 때 밖에서 고생하지 않고 한국잡월드 1부 체험 후 파미어스몰 이동하는 비 안 맞고 노는 코스입니다. 지하 주차장에서 바로 연결되어 편리해요.',
    imageUrl: '/images/job_world.jpg',
    likes: 128,
    comments: 31,
    views: 1420,
    tags: ['#비오는날', '#실내추천', '#잡월드', '#차량동선최적화'],
  },
  {
    id: 'post-4',
    category: '동네 소모임',
    title: '이번 주 토요일 오전 분당 중앙공원 킥보드/피크닉 모임해요 🌳',
    author: '수내동호랑이',
    locationBadge: '📍 분당구 수내동 인증',
    kidInfo: '4~6세 아이 맘/파',
    date: '1일 전',
    summary: '이번 주 날씨 좋을 때 아이들 킥보드 타고 간식 나눠먹는 맘파 모임 모집합니다. 돗자리와 유아 음료 준비해 오시면 됩니다! 댓글로 신청해 주세요.',
    imageUrl: '/images/eco_learning.jpg',
    likes: 35,
    comments: 18,
    views: 410,
    tags: ['#중앙공원', '#주말피크닉', '#동네육아모임'],
  },
]

export default function CommunityView({ userLocation, onOpenDetail }) {
  const [activeCat, setActiveCat] = useState('전체')
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [writeTitle, setWriteTitle] = useState('')
  const [writeContent, setWriteContent] = useState('')

  const categories = ['전체', '나들이 생생 후기', '키즈 프렌들리 맛집', '주차/유모차 꿀팁', '동네 소모임']

  const filteredPosts = activeCat === '전체'
    ? SAMPLE_POSTS
    : SAMPLE_POSTS.filter((p) => p.category === activeCat)

  const toggleLike = (id) => {
    const next = new Set(likedPosts)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setLikedPosts(next)
  }

  return (
    <div className="community-view">
      {/* Neighborhood Location Verification Banner */}
      <div className="location-verify-banner">
        <div className="verify-left">
          <div className="verify-badge">
            <IconPin className="icon" />
            <span>{userLocation?.addressName || '현재 위치 (분당구 정자동)'} GPS 인증 완료</span>
          </div>
          <h2>실제 동네 부모들의 생생 내돈내산 육아 & 나들이 블로그</h2>
          <p>분당·판교 지역 실거주 부모들이 직접 다녀온 장소 후기, 주차/유모차 꿀팁, 동네 소모임 정보입니다.</p>
        </div>
        <div className="verify-right">
          <button type="button" className="btn-write-post" onClick={() => setShowWriteModal(true)}>
            ✏️ 내 동네 후기 쓰기
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="community-cat-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`community-cat-chip ${activeCat === cat ? 'is-active' : ''}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Post Feed Grid */}
      <div className="community-grid">
        {filteredPosts.map((post) => {
          const isLiked = likedPosts.has(post.id)
          return (
            <article key={post.id} className="blog-card">
              <div className="blog-card-thumb">
                <img src={post.imageUrl} alt={post.title} className="blog-thumb-img" />
                <span className="blog-cat-badge">{post.category}</span>
                {post.oasisPass && (
                  <span className="blog-pass-badge">
                    <IconGift className="icon" /> {post.oasisPass}
                  </span>
                )}
              </div>

              <div className="blog-card-body">
                <div className="blog-author-row">
                  <div className="author-avatar">
                    <IconUser className="icon" />
                  </div>
                  <div className="author-info">
                    <div className="author-name-row">
                      <span className="author-name">{post.author}</span>
                      <span className="location-badge">{post.locationBadge}</span>
                    </div>
                    <span className="kid-info">{post.kidInfo} · {post.date}</span>
                  </div>
                </div>

                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-summary">{post.summary}</p>

                <div className="blog-tags">
                  {post.tags.map((t) => (
                    <span key={t} className="blog-tag">{t}</span>
                  ))}
                </div>

                <div className="blog-card-footer">
                  <div className="stat-group">
                    <button
                      type="button"
                      className={`btn-like ${isLiked ? 'is-liked' : ''}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      ❤️ {post.likes + (isLiked ? 1 : 0)}
                    </button>
                    <span className="stat-item">💬 {post.comments}</span>
                    <span className="stat-item">👁️ {post.views}</span>
                  </div>

                  <button type="button" className="btn-save-course">
                    <IconSparkle className="icon" /> 동선 퍼가기
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Write Post Modal */}
      {showWriteModal && (
        <div className="modal-overlay" onClick={() => setShowWriteModal(false)}>
          <div className="modal-container write-modal-container" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={() => setShowWriteModal(false)}>✕</button>
            <div className="write-modal-header">
              <h3>✏️ 동네 육아 & 나들이 후기 작성</h3>
              <span className="verified-pill">📍 {userLocation?.addressName || '정자동'} 인증 상태로 작성됩니다.</span>
            </div>

            <div className="write-form">
              <label className="form-label">
                제목
                <input
                  type="text"
                  placeholder="예: 주말 판교박물관 주차 꿀팁과 모래체험존 후기!"
                  value={writeTitle}
                  onChange={(e) => setWriteTitle(e.target.value)}
                />
              </label>

              <label className="form-label">
                생생 후기 내용
                <textarea
                  rows={5}
                  placeholder="아이와 다녀온 장소의 주차 편의성, 유모차 이동성, 아기의자 여부 등 부모들에게 유용한 정보를 적어주세요."
                  value={writeContent}
                  onChange={(e) => setWriteContent(e.target.value)}
                />
              </label>

              <button
                type="button"
                className="btn-submit-post"
                onClick={() => {
                  alert('성공적으로 게시글이 등록되었습니다!')
                  setShowWriteModal(false)
                  setWriteTitle('')
                  setWriteContent('')
                }}
              >
                게시글 등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
