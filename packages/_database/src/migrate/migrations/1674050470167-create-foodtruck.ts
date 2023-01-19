import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { mongo } }) => {
  await mongo.createCollection('foodtrucks')
}

export const down: Migration = async ({ context: { mongo } }) => {
  await mongo.dropCollection('foodtrucks')
}
