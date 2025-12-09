import { z } from 'zod'

// Absurd error messages that rotate
export const errorMessages = {
  name: {
    required: [
      "A name is required. Even 'Anonymous' counts.",
      "Who are you? We need a name.",
      "The form demands identification.",
    ],
    tooShort: [
      "That's barely a name. Try harder.",
      "Even nicknames are longer than that.",
      "My cat has a longer name.",
    ],
    needsFullName: [
      "Full name, please. First AND last.",
      "We need your complete name. This isn't Twitter.",
      "One name? Are you Madonna?",
    ],
    mustBeReversed: [
      "Write it backwards. Last name first, like official documents.",
      "Reverse order, please. Surname goes first here.",
      "Wrong order. Try: LastName FirstName",
    ],
  },
  email: {
    invalid: [
      "That doesn't look like an email. Or does it?",
      "Email format error. Probably.",
      "Is this even an email? Hard to tell.",
    ],
    tooMainstream: [
      "Gmail? Really? How original.",
      "We don't accept mainstream email providers.",
      "That email provider is too popular. Try something obscure.",
    ],
    tooOld: [
      "Hotmail? What year is this?",
      "That email provider belongs in a museum.",
      "Are you emailing from 2003?",
    ],
  },
  password: {
    tooShort: [
      "Password too short. Like your patience will be.",
      "Needs more characters. And more frustration.",
      "A toddler could crack that password.",
    ],
    needsUppercase: [
      "Add an uppercase letter. SHOUT a little.",
      "Needs a capital letter. Show some authority.",
      "No uppercase? How informal.",
    ],
    needsNumber: [
      "Add a number. Any number. Math is important.",
      "Numbers strengthen passwords. And test patience.",
      "Include a digit. Preferably not just '1' at the end.",
    ],
    needsSymbol: [
      "Add a symbol. Express yourself!",
      "Needs a special character. Get creative.",
      "Missing symbols. Try !@#$% or your frustration.",
    ],
    tooObvious: [
      "That password is embarrassingly obvious.",
      "Did you really just type 'password'?",
      "My grandmother could guess that password.",
    ],
  },
  age: {
    required: [
      "Age is required. Lie if you must.",
      "How old are you? Approximately?",
      "We need your age. For science.",
    ],
    tooYoung: [
      "Too young. Come back in a few years.",
      "Minors can't handle this form.",
      "You must be this tall to ride this form.",
    ],
    tooOld: [
      "Too old for the internet, apparently.",
      "Our system can't handle wisdom of your magnitude.",
      "Age limit exceeded. Blame the database.",
    ],
    tooCliche: [
      "21 is too cliche. Pick a real age.",
      "Everyone says they're 21. Be original.",
      "21? That's what everyone puts.",
    ],
  },
  terms: {
    required: [
      "Accept the terms you definitely didn't read.",
      "You must agree. Resistance is futile.",
      "Check the box. What's the worst that could happen?",
    ],
  },
  honeypot: {
    notEmpty: [
      "I told you not to fill this field.",
      "This was a trap. You fell for it.",
      "Leave this field empty. Reading is fundamental.",
    ],
  },
}

// Helper to get random message from array (use only on client side)
export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)]
}

// Base schema with absurd validations
// Use first message consistently to avoid hydration mismatch
export const formSchema = z.object({
  // Name: must be full name
  name: z
    .string()
    .min(1, { message: errorMessages.name.required[0] })
    .min(3, { message: errorMessages.name.tooShort[0] })
    .refine(
      (val) => val.trim().split(/\s+/).length >= 2,
      { message: errorMessages.name.needsFullName[0] }
    ),

  // Email: simple validation (the component handles the chaos)
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: errorMessages.email.invalid[0] }),

  // Password: complex requirements
  password: z
    .string()
    .min(8, { message: errorMessages.password.tooShort[0] })
    .refine(
      (val) => /[A-Z]/.test(val),
      { message: errorMessages.password.needsUppercase[0] }
    )
    .refine(
      (val) => /[0-9]/.test(val),
      { message: errorMessages.password.needsNumber[0] }
    )
    .refine(
      (val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val),
      { message: errorMessages.password.needsSymbol[0] }
    )
    .refine(
      (val) => !val.toLowerCase().includes('password'),
      { message: errorMessages.password.tooObvious[0] }
    ),

  // Age: impossibly narrow range
  age: z
    .number({ message: 'Age must be a number' })
    .nullable()
    .refine((val) => val !== null, { message: errorMessages.age.required[0] })
    .refine(
      (val) => val === null || val >= 18,
      { message: errorMessages.age.tooYoung[0] }
    )
    .refine(
      (val) => val === null || val <= 99,
      { message: errorMessages.age.tooOld[0] }
    ),

  // Terms: must be checked (but will uncheck itself)
  terms: z
    .boolean()
    .refine((val) => val === true, { message: errorMessages.terms.required[0] }),

  // Honeypot: trap field that should stay empty
  honeypot: z
    .string()
    .max(0, { message: errorMessages.honeypot.notEmpty[0] }),
})

export type FormSchemaType = z.infer<typeof formSchema>

// Dynamic password requirements that can change
export const allPasswordRequirements = [
  { id: 'length', label: 'At least 8 characters', check: (v: string) => v.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', check: (v: string) => /[A-Z]/.test(v) },
  { id: 'lowercase', label: 'One lowercase letter', check: (v: string) => /[a-z]/.test(v) },
  { id: 'number', label: 'One number', check: (v: string) => /[0-9]/.test(v) },
  { id: 'symbol', label: 'One special character', check: (v: string) => /[!@#$%^&*]/.test(v) },
  { id: 'noSpaces', label: 'No spaces allowed', check: (v: string) => !/\s/.test(v) },
  { id: 'noRepeating', label: 'No repeating characters', check: (v: string) => !/(.)\1{2,}/.test(v) },
  { id: 'mustHaveQ', label: 'Must contain the letter Q', check: (v: string) => /[qQ]/.test(v) },
  { id: 'noVowelsStart', label: 'Cannot start with a vowel', check: (v: string) => !/^[aeiouAEIOU]/.test(v) },
  { id: 'evenLength', label: 'Must have even length', check: (v: string) => v.length % 2 === 0 },
]

// Get initial requirements (reasonable ones)
export function getInitialRequirements() {
  return allPasswordRequirements.slice(0, 5).map(r => r.id)
}

// Swap one requirement for a harder one
export function swapRequirement(current: string[]): string[] {
  const available = allPasswordRequirements
    .filter(r => !current.includes(r.id))
    .map(r => r.id)

  if (available.length === 0) return current

  const newReq = available[Math.floor(Math.random() * available.length)]
  const toRemove = current[Math.floor(Math.random() * current.length)]

  return current.map(r => r === toRemove ? newReq : r)
}
