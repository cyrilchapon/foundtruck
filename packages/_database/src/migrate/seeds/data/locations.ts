import { v4 as uuid } from 'uuid'
import { LocationInsertWithId } from '../../../models'

const locations = {
  near: {
    id: uuid(),
    coords: [4.667267278754679, 45.99114034381097],
  },
  mid1: {
    id: uuid(),
    coords: [4.678343759963894, 45.982196002921256],
  },
  mid2: {
    id: uuid(),
    coords: [4.667267278754679, 45.97024611569546],
  },
  far1: {
    id: uuid(),
    coords: [4.692256283180001, 45.954440522082365],
  },
  far2: {
    id: uuid(),
    coords: [4.714635796228265, 45.94793942966675],
  },
} satisfies Record<string, LocationInsertWithId>

export default locations
