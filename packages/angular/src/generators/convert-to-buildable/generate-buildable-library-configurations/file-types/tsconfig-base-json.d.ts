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
    readonly paths?: { readonly [importPath: string]: readonly string[] };
  };
}
