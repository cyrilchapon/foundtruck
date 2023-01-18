import { BaseInsert, BaseInsertWithId, BaseUpdate } from './base'
import { GeoJSON, TypeJSON } from '@chimanos/foundtruck-common'
import { KnexOrTransaction } from '../util'
import knexPostgis from 'knex-postgis'

export type Location = {
  id: string
  coords: GeoJSON.Point
  created_at: Date
  updated_at: Date
}

export type LocationInsert = BaseInsert<Location>
export type LocationInsertWithId = BaseInsertWithId<Location>
export type LocationUpdate = BaseUpdate<Location>

export type RawLocation = Omit<Location, 'coords'> & {
  coords: string
}
export type RawLocationInsert = BaseInsert<RawLocation>
export type RawLocationInsertWithId = BaseInsertWithId<RawLocation>
export type RawLocationUpdate = BaseUpdate<RawLocation>

export const deserializeLocation = (rawLocation: RawLocation): Location => ({
  ...rawLocation,
  coords: TypeJSON.parse(rawLocation.coords, GeoJSON.pointSchema.parse),
})

export const serializeLocation = (location: Location): RawLocation => ({
  ...location,
  coords: TypeJSON.stringify(location.coords),
})

export const listLocations = (knex: KnexOrTransaction) => async () => {
  const st = knexPostgis(knex)

  const _locations = await knex('locations').select<RawLocation[]>(
    '*',
    st.asGeoJSON('coords'),
  )
  const locations = _locations.map((_l) => deserializeLocation(_l))

  return locations
}

type LocationWithinRequest = {
  coords: GeoJSON.Point
  radius: number
}

const METERS_TO_MILES_RATIO = 1 / 1609.34
const metersToMiles = (meters: number): number => meters * METERS_TO_MILES_RATIO

const degToRad = (degAngle: number): number => (degAngle * Math.PI) / 180
const getSphereFixFactor = (degLat: number): number =>
  Math.cos(degToRad(degLat))

const fixSphereRadius = (radius: number, point: GeoJSON.Point) =>
  radius / getSphereFixFactor(point.coordinates[1])
const fixSphereDistance = (distance: number, point: GeoJSON.Point) =>
  distance * getSphereFixFactor(point.coordinates[1])

export const listLocationsWithin =
  (knex: KnexOrTransaction) => async (withinRequest: LocationWithinRequest) => {
    const st = knexPostgis(knex)

    const fixedSphereRadius = fixSphereRadius(
      withinRequest.radius,
      withinRequest.coords,
    )

    const _locations = await knex('locations')
      .select<(RawLocation & { distance: number })[]>(
        '*',
        st.asGeoJSON('coords'),
        st
          .distance(
            st.transform(
              st.setSRID(
                st.makePoint(...withinRequest.coords.coordinates),
                4326,
              ),
              3857,
            ),
            st.transform('coords', 3857),
          )
          .as('distance'),
      )
      .where(
        st.dwithin(
          st.transform('coords', 3857),
          st.transform(
            st.setSRID(st.makePoint(...withinRequest.coords.coordinates), 4326),
            3857,
          ),
          fixedSphereRadius,
        ),
      )

    const _fixedDistanceLocations = _locations.map((_l) => ({
      ..._l,
      distance: fixSphereDistance(_l.distance, withinRequest.coords),
    }))

    const locations = _fixedDistanceLocations.map((_l) =>
      deserializeLocation(_l),
    )

    return locations
  }

export const vectorTile =
  (knex: KnexOrTransaction) =>
  async (x: number, y: number, z: number, extent: number, buffer: number) => {
    const st = knexPostgis(knex)

    const result = await knex.raw(
      `
      SELECT ST_AsMVT(q, 'admin', :extent, 'geom') as mvt
      FROM (
        SELECT id,
          ST_AsMvtGeom(
            st_transform(coords, 3857),
            BBox(:x, :y, :z),
            :extent,
            :buffer,
            true
          ) AS geom
        FROM locations
        WHERE st_transform(coords, 3857) && BBox(:x, :y, :z)
        AND ST_Intersects(st_transform(coords, 3857), BBox(:x, :y, :z))
      ) AS q;
    `,
      {
        x,
        y,
        z,
        extent,
        buffer,
      },
    )

    if ((result.rowCount ?? 0) < 1) {
      return null
    }
  
    const row = result.rows[0]
    const mvt = row?.mvt

    if (mvt == null || mvt.length === 0) {
      return null
    }
  
    return mvt
  }