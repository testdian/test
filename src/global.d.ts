declare module '*.module.less' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.md';
declare module '*.svg' {
  const content: string;
  export default content;
}

interface ImportMeta {
  env: {
    REACT_APP_API_TEMPLATE_FILE_URL: string;
    REACT_APP_API_URL: string;
    REACT_APP_API_FILE_UPLOAD_URL: string;
    REACT_APP_API_FILE_UPLOAD_RANDOMNAME_URL: string;
    REACT_APP_API_FILE_UPLOAD_URL_SALE: string;
    REACT_APP_API_FILE_UPLOAD_RANDOMNAME_URL_SALE: string;
    MODE: string;
    NODE_ENV: string;
  };
}
