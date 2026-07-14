export type StampStatus = 'LOCKED' | 'UNLOCKED'

export interface StampItem {
  stampId: number
  eventId: number
  name: string
  imageUrl: string | null
  status: StampStatus
  unlockedAt: string | null
}
