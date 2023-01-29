import type { Migration } from '../umzug'
import { genX } from './data'
import { fakeFoodtruck } from './data/foodtruck'

const seedUuid = '8cd2e71e-79b6-4798-bba4-40da96fb3aeb'
const foodtrucksGenerationCenter: [number, number] = [
  4.631328192143343, 45.98750190103448,
]
const foodtrucksDistanceRadius = 30
const foodtrucksCount = 50

export const up: Migration = async ({ context: { mongo } }) => {
  await mongo.collection('foodtrucks').insertMany(
    genX(() =>
      fakeFoodtruck({
        minMaxLocations: { min: 1, max: 3 },
        minMaxDayMeals: { min: 5, max: 12 },
        nearBy: foodtrucksGenerationCenter,
        radius: foodtrucksDistanceRadius,
        isKm: true,
        additionalData: {
          _seed: seedUuid,
        },
      }),
    )(foodtrucksCount),
  )
}

export const down: Migration = async ({ context: { mongo } }) => {
  mongo.collection('foodtrucks').deleteMany({
    _seed: seedUuid,
  })
}
