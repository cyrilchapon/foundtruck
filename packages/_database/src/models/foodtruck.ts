import { Model, Schema, Types } from 'mongoose'

export type Foodtruck = {
  _id: Types.ObjectId
  name: string
}

export const foodtruckSchema = new Schema<Foodtruck>({
  // _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
})

export type FoodtruckModel = Model<
  Foodtruck,
  Record<string, never>,
  Record<string, never>
>

export const foodtruckModelName = 'Foodtruck'
export const foodtruckCollectionName = 'foodtrucks'
