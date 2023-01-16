import type { Migration } from '../umzug'
import {
  createUpdateTimestampFn,
  createUpdateTrigger,
  dropUpdateTimestampFn,
  dropUpdateTrigger,
} from '../util'

export const up: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async (tx) => {
    await tx.schema.createTable('foodtrucks_locations', (t) => {
      t.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'))

      t.uuid('foodtruck_id').notNullable()
      t.uuid('location_id').notNullable()
      t.string('day').notNullable()
      t.string('meal').notNullable()

      t.foreign('foodtruck_id').references('id').inTable('foodtrucks')
      t.foreign('location_id').references('id').inTable('locations')
      t.foreign(['day', 'meal']).references(['day', 'meal']).inTable('days_meals')

      t.primary(['id'])
      t.unique(['foodtruck_id', 'day', 'meal'])
    })

    await createUpdateTimestampFn(tx)('foodtrucks_locations', 'updated_at')
    await createUpdateTrigger(tx)('foodtrucks_locations', 'updated_at')
  })
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async (tx) => {
    await dropUpdateTrigger(tx)('foodtrucks_locations', 'updated_at')
    await dropUpdateTimestampFn(tx)('foodtrucks_locations', 'updated_at')
    await tx.schema.dropTable('foodtrucks_locations')
  })
}
