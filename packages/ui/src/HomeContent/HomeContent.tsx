import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, UIEvent } from 'react'
import banner1 from '../assets/banner1.svg'
import banner2 from '../assets/banner2.svg'
import banner3 from '../assets/banner3.svg'

const banners = [
  { alt: '어썸 뮤직 페스티벌 초대 배너', src: banner1 },
  { alt: '덕행 추천 행사 배너', src: banner2 },
  { alt: '덕행 추천 콘텐츠 배너', src: banner3 },
] as const

export interface HomeRankingArtist {
  rank: number
  name: string
  imageUrl: string
  profileUrl: string
}

interface HomeContentProps {
  rankings?: HomeRankingArtist[]
  rankingPeriod?: string
  isRankingsLoading?: boolean
  rankingErrorMessage?: string
  onRankingRetry?: () => void
}

function HomeContent({
  rankings = [],
  rankingPeriod = '',
  isRankingsLoading = false,
  rankingErrorMessage = '',
  onRankingRetry = () => {},
}: HomeContentProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef({ left: 0, x: 0 })
  const [activeBanner, setActiveBanner] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isUserInteracting || prefersReducedMotion) return

    const autoplayTimer = window.setTimeout(() => {
      const carousel = carouselRef.current
      if (!carousel) return

      const nextBanner = (activeBanner + 1) % banners.length
      carousel.scrollTo({
        behavior: 'smooth',
        left: nextBanner * carousel.clientWidth,
      })
    }, 4000)

    return () => window.clearTimeout(autoplayTimer)
  }, [activeBanner, isUserInteracting])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    setIsUserInteracting(true)
    if (event.pointerType !== 'mouse' || !carouselRef.current) return

    dragStartRef.current = {
      left: carouselRef.current.scrollLeft,
      x: event.clientX,
    }
    carouselRef.current.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return

    event.preventDefault()
    carouselRef.current.scrollLeft =
      dragStartRef.current.left - (event.clientX - dragStartRef.current.x)
  }

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (carouselRef.current?.hasPointerCapture(event.pointerId)) {
      carouselRef.current.releasePointerCapture(event.pointerId)
    }
    setIsDragging(false)
    setIsUserInteracting(false)
  }

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const slideWidth = event.currentTarget.clientWidth
    if (!slideWidth) return

    setActiveBanner(Math.round(event.currentTarget.scrollLeft / slideWidth))
  }

  const moveToBanner = (index: number) => {
    carouselRef.current?.scrollTo({
      behavior: 'smooth',
      left: index * (carouselRef.current?.clientWidth ?? 0),
    })
  }

  return (
    <section className="w-full overflow-hidden bg-white px-5 pt-8 pb-10">
      <div aria-label="추천 배너" aria-roledescription="carousel" className="mx-auto max-w-sm">
        <div
          className={`flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? 'cursor-grabbing snap-none select-none' : 'cursor-grab'
          }`}
          onPointerCancel={stopDragging}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onScroll={handleScroll}
          ref={carouselRef}
        >
          {banners.map((banner, index) => (
            <figure
              aria-label={`${index + 1} / ${banners.length}`}
              aria-roledescription="slide"
              className="m-0 min-w-full snap-center overflow-hidden rounded-2xl bg-neutral-100"
              key={banner.src}
            >
              <img
                alt={banner.alt}
                className="aspect-[289/325] w-full object-cover"
                draggable={false}
                src={banner.src}
              />
            </figure>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5" role="group">
          {banners.map((banner, index) => (
            <button
              aria-label={`${index + 1}번째 배너 보기`}
              aria-pressed={activeBanner === index}
              className={`h-1.5 rounded-full transition-[width,background-color] ${
                activeBanner === index ? 'w-5 bg-neutral-800' : 'w-1.5 bg-neutral-300'
              }`}
              key={banner.src}
              onClick={() => moveToBanner(index)}
              type="button"
            />
          ))}
        </div>
      </div>

      <section
        aria-labelledby="popular-ranking-title"
        className="mx-auto mt-24 max-w-sm scroll-mt-24"
      >
        <h1
          className="text-center text-2xl font-extrabold tracking-[-0.04em] text-neutral-950"
          id="popular-ranking-title"
        >
          인기랭킹
        </h1>
        {rankingPeriod && (
          <p className="mt-1 text-center text-xs tracking-[-0.02em] text-neutral-400">
            {rankingPeriod}
          </p>
        )}

        {isRankingsLoading && (
          <p className="mt-7 py-10 text-center text-sm text-neutral-500">불러오는 중…</p>
        )}
        {!isRankingsLoading && rankingErrorMessage && (
          <div className="mt-7 flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-red-600" role="alert">
              {rankingErrorMessage}
            </p>
            <button
              className="min-h-10 rounded-full border px-5 text-sm font-bold"
              onClick={onRankingRetry}
              type="button"
            >
              다시 시도
            </button>
          </div>
        )}
        {!isRankingsLoading && !rankingErrorMessage && rankings.length === 0 && (
          <p className="mt-7 py-10 text-center text-sm text-neutral-500">인기 랭킹이 없어요.</p>
        )}
        {!isRankingsLoading && !rankingErrorMessage && rankings.length > 0 && (
          <ol className="mt-7 grid grid-flow-col grid-cols-2 grid-rows-5 gap-x-7 gap-y-5">
            {rankings.map(({ imageUrl, name, profileUrl, rank }) => (
              <li className="min-w-0" key={`${rank}-${name}`}>
                <a
                  className="flex items-center gap-3"
                  href={profileUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="w-5 shrink-0 text-right text-2xl font-medium text-neutral-500 tabular-nums">
                    {rank}
                  </span>
                  <img alt="" className="size-11 shrink-0 rounded-lg object-cover" src={imageUrl} />
                  <span className="truncate text-sm font-medium tracking-[-0.02em] text-neutral-600">
                    {name}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </section>
  )
}

export default HomeContent
