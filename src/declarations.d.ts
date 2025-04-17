// src/declarations.d.ts
declare module 'colorthief' {
    class ColorThief {
      getColor(image: HTMLImageElement, quality?: number): [number, number, number];
    }
  
    export default ColorThief;
  }