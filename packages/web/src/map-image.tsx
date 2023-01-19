import { FunctionComponent } from 'react'
import { useMap } from 'react-map-gl'

export type MapImageProps = {
  id: string
  src: string
  sdf?: boolean
}

const MapImage: FunctionComponent<MapImageProps> = (props) => {
  const { id, src, sdf } = props
  const { current: map } = useMap()

  if (map != null && !map.hasImage(id)) {
    map.loadImage(src, (error, image) => {
      if (error) throw error
      if (image != null && !map.hasImage(id))
        map.addImage(id, image, { sdf: sdf ?? false })
    })
  }

  return null
}

export default MapImage
