/**
 * Path map in TypeScript configuration. Mostly used in tsconfig.base.json.
 */
export interface TsconfigPathMap {
  readonly [importPath: string]: readonly string[];
}

/**
 * tsconfig.base.json configuration file in workspace root.
 */
export interface TsconfigBaseJson {
  /**
   * TypeScript compiler options.
   */
  readonly compilerOptions: {
    /**
     * Import paths also known as TypeScript path mappings.
     */
    readonly paths?: TsconfigPathMap;
  };
}
