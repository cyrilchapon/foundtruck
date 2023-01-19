import { Types } from 'mongoose'

export type FlattenId<T extends { _id: Types.ObjectId }> = Omit<T, '_id'> & {
  _id: string
}
