import type { Migration } from '../umzug'
import {
  createUpdateTimestampFn,
  createUpdateTrigger,
  dropUpdateTimestampFn,
  dropUpdateTrigger,
} from '../util'

export const up: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async tx => {
    await tx.schema.createTable('locations', (t) => {
      t.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'))
      // t.point('coords').notNullable()
      t.specificType('coords', 'geometry(point, 4326)').notNullable()
      t.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'))
      t.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'))

      t.primary(['id'])
    })

    await createUpdateTimestampFn(tx)('locations', 'updated_at')
    await createUpdateTrigger(tx)('locations', 'updated_at')
  })
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async tx => {
    await dropUpdateTrigger(tx)('locations', 'updated_at')
    await dropUpdateTimestampFn(tx)('locations', 'updated_at')
    await tx.schema.dropTable('locations')
  })
}
