import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { sample, sampleSize, random } from 'lodash'
import { days, meals } from '../../../models/day-meal'
import { z } from 'zod'

type MinMaxRange = {
  min: number
  max: number
}

type LocationOptions = {
  minMaxLocations: MinMaxRange
  minMaxDayMeals: MinMaxRange
  nearBy: [number, number]
  radius: number
  isKm: boolean
}

export const fakeFoodtruck = (
  options: {
    additionalData?: Record<string, unknown>
  } & LocationOptions,
) => {
  const foodtruckId = new ObjectId(faker.database.mongodbObjectId())
  const foodtruck = {
    _id: foodtruckId,
    name: faker.company.name(),
    ...options.additionalData,
  }
  const locations = fakeLocations(foodtruckId, options)

  return { foodtruck, locations }
}

export const fakeLocations = (
  foodtruckId: ObjectId,
  options: {
    additionalData?: Record<string, unknown>
  } & LocationOptions,
) => {
  const {
    minMaxLocations: { min: minLocations, max: maxLocations },
    minMaxDayMeals: { min: minDayMeals, max: maxDayMeals },
    nearBy,
    radius,
    isKm,
    additionalData,
  } = options

  z.number().int().min(1).lte(maxLocations).parse(minLocations)
  z.number().int().max(5).gte(minLocations).parse(maxLocations)

  const locationsCount = random(minLocations, maxLocations)

  z.number()
    .int()
    .min(Math.max(4, locationsCount))
    .lte(maxDayMeals)
    .parse(minDayMeals)
  z.number().int().max(_daysMeals.length).gte(minDayMeals).parse(maxDayMeals)

  const dayMealsCount = random(minDayMeals, maxDayMeals)
  const dayMeals = sampleSize(_daysMeals, dayMealsCount)

  const chunkedDayMeals = randomChunks(dayMeals, locationsCount)
  const locations = chunkedDayMeals.map((locationDayMeals) => ({
    _id: new ObjectId(faker.database.mongodbObjectId()),
    name: faker.address.street(),
    point: fakePoint(nearBy, radius, isKm),
    dayMeals: locationDayMeals,
    foodtruck: foodtruckId,
    ...additionalData,
  }))

  return locations
}

export const fakePoint = (
  nearBy: [number, number],
  radius: number,
  isKm: boolean,
) => ({
  type: 'Point',
  coordinates: faker.address
    .nearbyGPSCoordinate(nearBy, radius, isKm)
    .map((v) => Number(v)),
})

const _daysMeals = days.flatMap((day) =>
  meals.map((meal) => ({
    day,
    meal,
  })),
)

const randomChunks = <T>(items: T[], groupsCount: number): T[][] => {
  if (groupsCount > items.length) {
    throw new Error('groupsCount should be <= arr.length')
  }

  let usedItems: T[] = []

  const chunkedItems = new Array(groupsCount)
    .fill(null)
    .map((_v, groupIndex) => {
      const remainingPasses = groupsCount - (groupIndex + 1)
      const remainingItems = items.filter((item) => !usedItems.includes(item))

      const groupItemsCount =
        remainingPasses !== 0
          ? random(1, remainingItems.length - remainingPasses)
          : remainingItems.length

      const groupItems = sampleSize(remainingItems, groupItemsCount)
      usedItems = [...usedItems, ...groupItems]

      return groupItems
    })

  return chunkedItems
}
