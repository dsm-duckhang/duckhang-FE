import { useEffect, useState } from 'react'
import HomeContent from '@repo/ui/home-content'
import { getPopularRanking } from '@/features/rankings/api/getPopularRanking'
import type { PopularRankingArtist } from '@/features/rankings/model/ranking'

function HomePage() {
  const [rankings, setRankings] = useState<PopularRankingArtist[]>([])
  const [rankingPeriod, setRankingPeriod] = useState('')
  const [isRankingsLoading, setIsRankingsLoading] = useState(true)
  const [rankingErrorMessage, setRankingErrorMessage] = useState('')
  const [requestKey, setRequestKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getPopularRanking(controller.signal)
      .then(({ artists, period }) => {
        setRankings(artists)
        setRankingPeriod(period)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setRankings([])
        setRankingPeriod('')
        setRankingErrorMessage(
          error instanceof Error ? error.message : '인기 랭킹을 불러오지 못했어요.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsRankingsLoading(false)
      })

    return () => controller.abort()
  }, [requestKey])

  function handleRankingRetry() {
    setIsRankingsLoading(true)
    setRankingErrorMessage('')
    setRequestKey((key) => key + 1)
  }

  return (
    <HomeContent
      isRankingsLoading={isRankingsLoading}
      onRankingRetry={handleRankingRetry}
      rankingErrorMessage={rankingErrorMessage}
      rankingPeriod={rankingPeriod}
      rankings={rankings}
    />
  )
}

export default HomePage
