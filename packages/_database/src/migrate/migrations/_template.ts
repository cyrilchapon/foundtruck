import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { mongo } }) => {
  // await mongo.createCollection()
}

export const down: Migration = async ({ context: { mongo } }) => {
  // await mongo.dropCollection()
}
