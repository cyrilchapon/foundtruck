import type { Migration } from '../umzug'

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

const meals = ['breakfast', 'lunch', 'dinner']

export const up: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async (tx) => {
    await tx.batchInsert<{ name: string }>(
      'days',
      days.map((d) => ({ name: d })),
    )

    await tx.batchInsert<{ name: string }>(
      'meals',
      meals.map((m) => ({ name: m })),
    )

    await tx.batchInsert<{ day: string; meal: string }>(
      'days_meals',
      meals.flatMap((m) =>
        days.map((d) => ({
          day: d,
          meal: m,
        })),
      ),
    )
  })
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async (tx) => {
    await tx('days_meals').delete()
    await tx('meals').delete()
    await tx('days').delete()
  })
}
