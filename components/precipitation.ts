export type PrecipitationCoverageRawValue = 'none' | 'slight chance' | 'chance' | 'likely' | 'occasional'

export interface PrecipitationCoverageValue {
  value: number
  shortLabel: string
}

export const precipitationCoverageLabelToValueMap: Map<string, PrecipitationCoverageValue> = new Map([
  [
    'none', {
      value: 0,
      shortLabel: '',
    }
  ],
  [
    'slight chance', {
      value: 1,
      shortLabel: 'sch',
    }
  ],
  [
    'chance', {
      value: 2,
      shortLabel: 'cha',
    }
  ],
  [
    'likely', {
      value: 3,
      shortLabel: 'like',
    }
  ],
  [
    'occasional', {
      value: 4,
      shortLabel: 'occ',
    }
  ],
])
