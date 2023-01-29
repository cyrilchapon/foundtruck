import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { mongo } }) => {
  await mongo.createCollection('foodtrucks')
  await mongo.createCollection('foodtrucks2')
}

export const down: Migration = async ({ context: { mongo } }) => {
  await mongo.dropCollection('foodtrucks2')
  await mongo.dropCollection('foodtrucks')
}
