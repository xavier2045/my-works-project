declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

declare module '*.mp4' {
    const content: string;
    export default content;
}

declare module "*.json" {
    const value: any;
    export default value;
}

  