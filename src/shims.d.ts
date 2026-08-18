// Global TypeScript shims to fallback unresolved type modules when node_modules are not installed
declare module '*';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Quiet vite/client missing types warning
declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly [key: string]: string | boolean | undefined;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
