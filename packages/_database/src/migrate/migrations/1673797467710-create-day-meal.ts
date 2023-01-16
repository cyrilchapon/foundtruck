import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async tx => {
    await tx.schema.createTable('days', (t) => {
      t.string('name').notNullable()
  
      t.primary(['name'])
    })
  
    await tx.schema.createTable('meals', (t) => {
      t.string('name').notNullable()
  
      t.primary(['name'])
    })

    await tx.schema.createTable('days_meals', (t) => {
      t.string('day').notNullable()
      t.string('meal').notNullable()
  
      t.foreign('day').references('name').inTable('days')
      t.foreign('meal').references('name').inTable('meals')

      t.primary(['day', 'meal'])
    })
  })
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async tx => {
    await tx.schema.dropTable('days_meals')
    await tx.schema.dropTable('days')
    await tx.schema.dropTable('meals')
  })
}
