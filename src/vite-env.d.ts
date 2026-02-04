/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'sit' | 'production';
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_APP_RESOURCE_URL: string;
  readonly VITE_APP_SERVE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
