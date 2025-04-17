// types/custom.d.ts
export {};

declare global {
  interface HTMLElement {
    _pointerDownHandler?: EventListener;
    _pointerMoveHandler?: EventListener;
    _pointerUpHandler?: EventListener;
    _pointerCancelHandler?: EventListener;
  }
}