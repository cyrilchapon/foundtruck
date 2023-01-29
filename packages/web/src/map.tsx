import {
  Layer,
  Map,
  MapRef,
  Marker,
  MarkerDragEvent,
  Source,
} from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import { useSystemColorMode } from './hooks/use-system-color-mode'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Pin from './user-pin'

import 'maplibre-gl/dist/maplibre-gl.css'
import { franceCenter } from './util'
import useGeolocation from 'react-hook-geolocation'
import MapImage from './map-image'
import type { Feature, Point } from 'geojson'
import { distance } from '@turf/turf'
import { throttle } from 'lodash'

const systemColorMapStyles = {
  dark: 'https://api.maptiler.com/maps/streets-v2-dark/style.json?key=ykkVoTRA4nCSnF4onbUp',
  light:
    'https://api.maptiler.com/maps/streets-v2-light/style.json?key=ykkVoTRA4nCSnF4onbUp',
}

type UnderlyingMap = ReturnType<MapRef['getMap']>

const AppMap = () => {
  const colorMode = useSystemColorMode()
  const mapStyle = React.useMemo(
    () => systemColorMapStyles[colorMode],
    [colorMode],
  )

  const {
    error: userLocErr,
    longitude: userLng,
    latitude: userLat,
  } = useGeolocation()
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (userLocErr == null && userLng != null && userLat != null) {
      setUserLoc([userLng, userLat])
    }
  }, [userLocErr, userLng, userLat])

  const mapRef = React.useRef<MapRef>(null)

  const [map, setMap] = React.useState<UnderlyingMap | null>(null)

  React.useEffect(() => {
    if (mapRef.current != null) {
      setMap(mapRef.current.getMap())
    }
  }, [mapRef.current])
  const handleMapLoad = () => {
    if (mapRef.current != null) {
      setMap(mapRef.current.getMap())
    }
  }
  const handleUserLocDrag = (e: MarkerDragEvent) => {
    setUserLoc([e.lngLat.lng, e.lngLat.lat])
  }

  const [viewState, setViewState] = React.useState({
    longitude: franceCenter[0],
    latitude: franceCenter[1],
    zoom: 2,
  })

  const updateFeaturesDistance = useMemo(
    () =>
      throttle(
        _updateFeaturesDistance('foodtrucks-source', 'foodtrucks', 'distance'),
        100,
      ),
    [],
  )

  const handleInteraction = useCallback(() => {
    updateFeaturesDistance(userLoc, map)
  }, [map, userLoc, updateFeaturesDistance])

  // React.useEffect(() => {
  //   if (userLoc != null) {
  //     setViewState({
  //       longitude: userLoc[0],
  //       latitude: userLoc[1],
  //       zoom: 12,
  //     })
  //   }
  // }, [userLoc])

  return (
    <Map
      mapLib={maplibregl}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle={mapStyle}
      ref={mapRef}
      onLoad={handleMapLoad}
      onDrag={handleInteraction}
      onZoom={handleInteraction}
      onRotate={handleInteraction}
      onPitch={handleInteraction}
      onSourceData={handleInteraction}
    >
      <MapImage id="marker" src="/foodtruck.png" sdf />

      <Source
        id="foodtrucks-source"
        type="vector"
        tiles={['http://localhost:1337/tiles/{z}/{x}/{y}.pbf']}
        // promoteId="id"
      >
        <Layer
          id="foodtrucks-icons"
          source="foodtrucks-source"
          type="symbol"
          source-layer="foodtrucks"
          minzoom={8}
          interactive={true}
          layout={{
            'icon-image': `marker`,
            // 'icon-anchor': 'bottom',
            'icon-allow-overlap': true,
            'icon-size': [
              'interpolate',
              // Set the exponential rate of change to 0.5
              ['exponential', 0.5],
              ['zoom'],
              // When zoom is 15, buildings will be beige.
              10,
              0.15,
              // When zoom is 18 or higher, buildings will be yellow.
              18,
              0.3,
            ],
          }}
          paint={{
            'icon-color':
              userLoc != null
                ? [
                    'step',
                    ['feature-state', 'distance'],
                    '#E02F58',
                    5000,
                    '#555555',
                  ]
                : '#E02F58',
            'icon-opacity':
              userLoc != null
                ? [
                    'step',
                    ['feature-state', 'distance'],
                    1,
                    5000,
                    0.35,
                    10000,
                    0,
                  ]
                : 0.8,
          }}
        />
      </Source>

      {userLoc != null ? (
        <>
          <Marker
            longitude={userLoc[0]}
            latitude={userLoc[1]}
            anchor="bottom"
            draggable
            // onDragStart={onMarkerDragStart}
            onDrag={handleUserLocDrag}
            // onDragEnd={onMarkerDragEnd}
          >
            <Pin size={20} />
          </Marker>

          <Source
            id="user-loc"
            type="geojson"
            data={{
              type: 'Feature',
              properties: {
                lng: userLoc[0],
                lat: userLoc[1],
              },
              geometry: {
                type: 'Point',
                coordinates: userLoc,
              },
            }}
          >
            <Layer
              id="user-secondary-circle"
              source="user-loc"
              type="circle"
              // beforeId="foodtrucks-icons"
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['exponential', 2],
                  ['zoom'],
                  0,
                  0,
                  20,
                  [
                    '/',
                    ['/', 10000, 0.075],
                    ['cos', ['*', ['get', 'lat'], ['/', Math.PI, 180]]],
                  ],
                ],
                'circle-color': '#E02F58',
                'circle-opacity': 0.05,
              }}
            />

            <Layer
              id="user-primary-circle"
              source="user-loc"
              type="circle"
              // beforeId="foodtrucks-icons"
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['exponential', 2],
                  ['zoom'],
                  0,
                  0,
                  20,
                  [
                    '/',
                    ['/', 5000, 0.075],
                    ['cos', ['*', ['get', 'lat'], ['/', Math.PI, 180]]],
                  ],
                ],
                'circle-color': '#E02F58',
                'circle-opacity': 0.1,
              }}
            />
          </Source>
        </>
      ) : null}
    </Map>
  )
}

const _updateFeaturesDistance =
  (sourceId: string, layerId: string, featureStateName: string) =>
  (userLoc: [number, number] | null, map: UnderlyingMap | null) => {
    if (userLoc != null && map != null) {
      const userLocFeature: Feature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: userLoc,
        },
        properties: {},
      }

      const features =
        map.querySourceFeatures(sourceId, {
          sourceLayer: layerId,
        }) ?? []

      features.forEach((f) => {
        if (
          f.id != null &&
          f.type === 'Feature' &&
          f.geometry.type === 'Point'
        ) {
          const distanceFromUser =
            distance(f as Feature<Point>, userLocFeature) * 1000
          map.setFeatureState(
            {
              ...f,
              source: sourceId,
              sourceLayer: layerId,
            },
            {
              [featureStateName]: distanceFromUser,
            },
          )
        }
      })
    }
  }

export default AppMap
