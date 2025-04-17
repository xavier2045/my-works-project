// types.ts
export interface TreeNode {
    id: string
    name: string
    image: string
    children?: TreeNode[]
    meta?: Record<string, unknown>
  }
  
  export interface FamilyTreeProps {
    title?: string
    apiUrl: string
    initialScale?: number
    backgroundBlur?: number
  }
  
  export type VantaEffect = {
    destroy: () => void
    resize: () => void
    options: {
      blurFactor: number
    }
  }