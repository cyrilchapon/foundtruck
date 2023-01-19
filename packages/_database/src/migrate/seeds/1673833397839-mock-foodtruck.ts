import type { Migration } from '../umzug'
import { genX } from './data'
import { fakeFoodtruck } from './data/foodtruck'

const seedUuid = '8cd2e71e-79b6-4798-bba4-40da96fb3aeb'
const foodtrucksCount = 2

export const up: Migration = async ({ context: { mongo } }) => {
  await mongo.collection('foodtrucks').insertMany(
    genX(() =>
      fakeFoodtruck([4.631328192143343, 45.98750190103448], 10, true, {
        _seed: seedUuid,
      }),
    )(foodtrucksCount),
  )
}

export const down: Migration = async ({ context: { mongo } }) => {
  mongo.collection('foodtrucks').deleteMany({
    _seed: seedUuid,
  })
}
