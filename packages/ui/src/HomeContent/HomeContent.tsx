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

const rankings = [
  { color: '#d9c8f2', name: '리센느' },
  { color: '#c6dcef', name: 'CORTIS' },
  { color: '#f3c6bc', name: '에스파' },
  { color: '#e4d0ef', name: '하츠투하츠' },
  { color: '#bedde2', name: '아일릿' },
  { color: '#e6c9b7', name: '라이즈' },
  { color: '#c9d5ef', name: '아이브' },
  { color: '#efc7d4', name: '르세라핌' },
  { color: '#cadfc8', name: '엔믹스' },
  { color: '#e8d7a8', name: '키키' },
] as const

function HomeContent() {
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

        <ol className="mt-7 grid grid-flow-col grid-cols-2 grid-rows-5 gap-x-7 gap-y-5">
          {rankings.map(({ color, name }, index) => (
            <li className="flex min-w-0 items-center gap-3" key={`${index}-${name}`}>
              <span className="w-5 shrink-0 text-right text-2xl font-medium text-neutral-500 tabular-nums">
                {index + 1}
              </span>
              <span
                aria-hidden="true"
                className="size-11 shrink-0 rounded-lg"
                style={{ backgroundColor: color }}
              />
              <span className="truncate text-sm font-medium tracking-[-0.02em] text-neutral-600">
                {name}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </section>
  )
}

export default HomeContent
