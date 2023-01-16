import { FoodtruckInsertWithId } from '../../models'
import type { Migration } from '../umzug'
import foodtrucks from './data/foodtruck'

export const up: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async tx => {
    await tx.batchInsert<FoodtruckInsertWithId>('foodtrucks', Object.values(foodtrucks))
  })
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async tx => {
    await tx('foodtrucks').delete()
  })
}
