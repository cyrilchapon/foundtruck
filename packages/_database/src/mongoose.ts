import { Mongoose } from 'mongoose'

export const createMongoose = () => {
  const mongoose = new Mongoose()
  return mongoose
}
