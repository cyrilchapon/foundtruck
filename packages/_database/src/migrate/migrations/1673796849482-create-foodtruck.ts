import type { Migration } from '../umzug'
import {
  createUpdateTimestampFn,
  createUpdateTrigger,
  dropUpdateTimestampFn,
  dropUpdateTrigger,
} from '../util'

export const up: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async (tx) => {
    await tx.schema.createTable('foodtrucks', (t) => {
      t.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'))
      t.string('name').notNullable()
      t.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'))
      t.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'))

      t.primary(['id'])
    })

    await createUpdateTimestampFn(tx)('foodtrucks', 'updated_at')
    await createUpdateTrigger(tx)('foodtrucks', 'updated_at')
  })
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async (tx) => {
    await dropUpdateTrigger(tx)('foodtrucks', 'updated_at')
    await dropUpdateTimestampFn(tx)('foodtrucks', 'updated_at')
    await tx.schema.dropTable('foodtrucks')
  })
}
