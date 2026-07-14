export interface PopularRankingArtist {
  rank: number
  name: string
  imageUrl: string
  profileUrl: string
}

export interface PopularRanking {
  period: string
  artists: PopularRankingArtist[]
}
