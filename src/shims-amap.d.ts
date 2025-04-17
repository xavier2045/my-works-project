interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string;
  };
}

declare namespace AMap {
  class Map {
    constructor(container: string | HTMLDivElement, options?: MapOptions);
    on(event: string, handler: (e: any) => void): void;
    destroy(): void; // 添加 destroy 方法
    setCenter(position: LngLat): void;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setPosition(position: LngLat): void;
  }

  class Icon {
    constructor(options: IconOptions);
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Geocoder {
    constructor(options?: GeocoderOptions);
    getAddress(lnglat: LngLat, callback: (status: string, result: any) => void): void;
  }

  class PlaceSearch {
    constructor(options: PlaceSearchOptions);
    search(keyword: string, callback: (status: string, result: any) => void): void;
  }

  interface MapOptions {
    zoom?: number;
    center?: LngLat;
  }

  interface MarkerOptions {
    position: LngLat;
    content?: string;
    anchor: string;
    icon?: Map;
    map?: Map;
  }

  interface IconOptions {
    size?: Size;
    image?: string;
    imageSize?: Size;
  }

  interface SizeOptions {
    width: number;
    height: number;
  }

  interface GeocoderOptions {}

  interface PlaceSearchOptions {
    city?: string;
    map?: Map;
  }

  function plugin(name: string | string[], callback: () => void): void;

  type LngLat = [number, number];
}


