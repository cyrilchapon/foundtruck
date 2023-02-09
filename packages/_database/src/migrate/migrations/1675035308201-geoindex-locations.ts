import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { mongo } }) => {
  await mongo.db().collection('locations').createIndex(
    {
      point: '2dsphere',
    },
    {
      name: 'locationsPoint2dSphere',
    },
  )
}

export const down: Migration = async ({ context: { mongo } }) => {
  await mongo.db().collection('locations').dropIndex('locationsPoint2dSphere')
}
