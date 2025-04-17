declare module 'treant-js' {
    class Treant {
      constructor(config: any)
      destroy(): void
    }
    export default Treant
  }
  
  declare module 'treant-js/vendor/raphael' {
    const Raphael: any
    export default Raphael
  }