// Form field types
export interface FormValues {
  name: string
  email: string
  password: string
  age: number | null
  terms: boolean
  honeypot: string // trap field - should remain empty
}

// Defense level increases frustration
export type DefenseLevel = 1 | 2 | 3

// Stats tracked throughout the form
export interface FormStats {
  totalAttempts: number
  validationErrors: number
  buttonChases: number
  timeSpent: number // in seconds
  fieldsShuffled: number
  checkboxResets: number
  passwordRequirementChanges: number
}

// Form state for managing defenses
export interface FormDefenseState {
  defenseLevel: DefenseLevel
  buttonFleeCount: number
  shuffleCount: number
  checkboxTimeRemaining: number | null
  currentPasswordRequirements: string[]
  isFormSurrendered: boolean
}

// Component props
export interface FleeingButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  fleeCount: number
  onFlee: () => void
  surrendered?: boolean
}

export interface LyingLabelProps {
  displayText: string
  actualHint: string
  showHint: boolean
  htmlFor?: string
}

export interface SelfUncheckingCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  timeLimit: number // seconds before unchecking
  onTimeExpired: () => void
  disabled?: boolean
}

export interface GaslightingPasswordProps {
  value: string
  onChange: (value: string) => void
  requirements: string[]
  onRequirementsChange: (newReqs: string[]) => void
  error?: string
}

export interface FrustrationMeterProps {
  stats: FormStats
  defenseLevel: DefenseLevel
}
