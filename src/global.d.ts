// Типы для изображений
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

// Типы для CSS/SCSS-модулей
declare module "*.module.css" {
  const styles: { [key: string]: string };
  export default styles;
}

declare module "*.module.scss" {
  const styles: { [key: string]: string };
  export default styles;
}
