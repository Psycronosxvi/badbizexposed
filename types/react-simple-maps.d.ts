declare module 'react-simple-maps' {
  import * as React from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: {
      center?: [number, number]
      rotate?: [number, number, number]
      scale?: number
    }
    width?: number
    height?: number
    className?: string
    children?: React.ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (props: { geographies: Geography[] }) => React.ReactNode
  }

  export interface Geography {
    rsmKey: string
    properties: {
      name: string
      [key: string]: any
    }
    [key: string]: any
  }

  export interface GeographyProps {
    geography: Geography
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
    onMouseEnter?: (event: React.MouseEvent) => void
    onMouseLeave?: (event: React.MouseEvent) => void
    onClick?: (event: React.MouseEvent) => void
    className?: string
  }

  export interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
    children?: React.ReactNode
  }

  export const ComposableMap: React.FC<ComposableMapProps>
  export const Geographies: React.FC<GeographiesProps>
  export const Geography: React.FC<GeographyProps>
  export const ZoomableGroup: React.FC<ZoomableGroupProps>
}
