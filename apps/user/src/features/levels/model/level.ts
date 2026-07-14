export interface LevelSummary {
  level: number
  name: string
  stampCount: number
  currentLevelMinStamps: number
  nextLevelMinStamps: number | null
  stampsToNextLevel: number | null
}
