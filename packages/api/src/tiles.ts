import { findAsGeoJSONFeatures, Models } from '@chimanos/foundtruck-db'
import { FeatureCollection, Point } from 'geojson'
import geojsonVt, { Tile } from 'geojson-vt'
import { logger } from './log'
import zlib from 'zlib'
import { promisify } from 'util'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vtpbf = require('vt-pbf')

const gzip = promisify(zlib.gzip)

export type GeoJSONVT = ReturnType<typeof geojsonVt>

let _tileIndex: GeoJSONVT | null = null

export const buildTileIndex = async (models: Models, rebuild = false) => {
  if (_tileIndex == null || rebuild) {
    const _features = await findAsGeoJSONFeatures(models.foodtruck)()
    const features = _features.map((feature) => ({
      ...feature,
      // In geoJSON, feature.id has to be a number
      // Last portion of Mongo.ObjectID (char 18-23) is
      // the increment value expressed in hexadecimal
      id: parseInt((feature.id as string).slice(18, 23), 16),
    }))

    const featureCollection: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features,
    }

    _tileIndex = geojsonVt(featureCollection, {
      // promoteId: 'location._id',
    })

    logger.info(
      `Successfully build tile index with ${features.length} features`,
    )
  }

  return _tileIndex
}

export const getMvtTile =
  <T extends string>(tileIndexes: Record<T, GeoJSONVT>) =>
  async (z: number, x: number, y: number) => {
    const pbfTile = getPbfTile(tileIndexes)(z, x, y)
    const mvtTile = await gzip(pbfTile)
    return mvtTile
  }

export const getPbfTile =
  <T extends string>(tileIndexes: Record<T, GeoJSONVT>) =>
  (z: number, x: number, y: number) => {
    const jsonTiles = getJsonTile(tileIndexes)(z, x, y)

    const pbfTile = tilesToPbf(jsonTiles)

    return pbfTile
  }

export const getJsonTile =
  <T extends string>(tileIndexes: Record<T, GeoJSONVT>) =>
  (z: number, x: number, y: number) => {
    const tileIndexesEntries = Object.entries(tileIndexes) as [T, GeoJSONVT][]
    const jsonTilesEntries = tileIndexesEntries.map<[T, Tile | null]>(
      ([k, tileIndex]) => [k, tileIndex.getTile(z, x, y)],
    )
    const jsonTiles = Object.fromEntries(jsonTilesEntries) as Record<
      T,
      Tile | null
    >

    return jsonTiles
  }

export const tilesToPbf = <T extends string>(
  jsonTiles: Record<T, Tile | null>,
) => {
  const jsonTilesEntries = Object.entries(jsonTiles) as [T, Tile | null][]
  const nonEmptyJsonTilesEntries = jsonTilesEntries.filter(
    ([, tile]) => tile != null,
  ) as [T, Tile][]
  const nonEmptyJsonTiles = Object.fromEntries(
    nonEmptyJsonTilesEntries,
  ) as Record<T, Tile>

  return vtpbf.fromGeojsonVt(nonEmptyJsonTiles, { version: 2 }) as Uint8Array
}
