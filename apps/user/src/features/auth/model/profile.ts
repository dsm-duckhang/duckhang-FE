export type UserRole = string

export interface UserLevel {
  level: number
  name: string
  stampCount: number
  currentLevelMinStamps: number
  nextLevelMinStamps: number | null
  stampsToNextLevel: number | null
}

export interface MyProfile {
  id: number
  email: string
  nickname: string
  profileImageUrl: string | null
  role: UserRole
  level: UserLevel | null
}
