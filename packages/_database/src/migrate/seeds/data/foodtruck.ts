import { v4 as uuid } from 'uuid'
import { FoodtruckInsertWithId } from '../../../models'

const foodtrucks = {
  myFoodTruck: { id: uuid(), name: 'My foodtruck' },
} satisfies Record<string, FoodtruckInsertWithId>

export default foodtrucks
