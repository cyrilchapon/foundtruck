import { DayMeal, days, meals } from '@chimanos/foundtruck-db'
import { z } from 'zod'

export const dayMealZ = z
  .object({
    day: z.enum(days),
    meal: z.enum(meals),
  })
  .strict() satisfies z.ZodType<DayMeal>

export type SerializedDayMeal = z.infer<typeof dayMealZ>
