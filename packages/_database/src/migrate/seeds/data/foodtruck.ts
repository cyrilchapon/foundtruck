import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'

export const fakeLocation = (
  nearBy: [number, number],
  radius: number,
  isKm: boolean,
  additionalData?: Record<string, unknown>,
) => ({
  _id: new ObjectId(faker.database.mongodbObjectId()),
  name: faker.address.street(),
  point: {
    type: 'Point',
    coordinates: faker.address
      .nearbyGPSCoordinate(nearBy, radius, isKm)
      .map((v) => Number(v)),
  },
  ...additionalData,
})

export const fakeFoodtruck = (
  nearBy: [number, number],
  radius: number,
  isKm: boolean,
  additionalData?: Record<string, unknown> & {
    location?: Record<string, unknown>
  },
) => ({
  name: faker.company.name(),
  ...additionalData,
  location: fakeLocation(nearBy, radius, isKm, additionalData?.location),
})
