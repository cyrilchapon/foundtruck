import knexPostgis from 'knex-postgis'
import { LocationInsertWithId } from '../../models'
import type { Migration } from '../umzug'
import locations from './data/locations'

export const up: Migration = async ({ context: { knex } }) => {
  const st = knexPostgis(knex)

  await knex.transaction(async tx => {
    await tx.batchInsert<LocationInsertWithId>('locations', Object.values(locations).map(l => ({
      ...l,
      coords: st.point(...l.coords)
    })))
  })
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.transaction(async tx => {
    await tx('locations').delete()
  })
}
