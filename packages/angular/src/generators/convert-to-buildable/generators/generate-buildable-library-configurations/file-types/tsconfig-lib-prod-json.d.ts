/**
 * Angular compiler options in a TypeScript configuration file
 * (tsconfig[.*].json).
 */
export interface AngularCompilerOptions {
  /**
   * `true` uses the Angular Ivy compiler. `false` uses the Angular View Engine
   * compiler.
   */
  readonly enableIvy?: boolean;
}

/**
 * tsconfig.lib.prod.json configuration file in project root folder. Used for
 * `production` configuration to the `build` target of a buildable library.
 */
export interface TsconfigLibProdJson {
  /**
   * References tsconfig.lib.json in the same directory.
   */
  readonly extends: string;
  /**
   * TypeScript compiler options.
   */
  readonly compilerOptions: {
    /**
     * When set to `true` while the `declaration` option is enabled, a
     * `d.ts.map` source map is also output. Set to `false` in production builds
     * for faster compilation.
     */
    readonly declarationMap: boolean;
  };
  /**
   * Angular compiler options.
   */
  readonly angularCompilerOptions: AngularCompilerOptions;
}
