declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module 'react-select';
declare module 'react-select/creatable';
declare module 'react-window';
declare module 'react-window-infinite-loader';
