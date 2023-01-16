import { BaseInsert, BaseInsertWithId, BaseUpdate } from './base'

export type Foodtruck = {
  id: string
  name: string
  created_at: Date
  updated_at: Date
}

export type FoodtruckInsert = BaseInsert<Foodtruck>
export type FoodtruckInsertWithId = BaseInsertWithId<Foodtruck>
export type FoodtruckUpdate = BaseUpdate<Foodtruck>
