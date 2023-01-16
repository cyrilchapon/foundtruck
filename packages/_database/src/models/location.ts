import { BaseInsert, BaseInsertWithId, BaseUpdate } from './base'

export type LocationPoint = [number, number]

export type Location = {
  id: string
  coords: LocationPoint
  created_at: Date
  updated_at: Date
}

export type LocationInsert = BaseInsert<Location>
export type LocationInsertWithId = BaseInsertWithId<Location>
export type LocationUpdate = BaseUpdate<Location>
