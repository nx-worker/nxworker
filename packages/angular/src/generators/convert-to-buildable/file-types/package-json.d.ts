/**
 * package.json configuration file in workspace root directory.
 */
export interface WorkspaceRootPackageJson {
  /**
   * Package dependencies not used during runtime.
   */
  readonly devDependencies?: {
    /**
     * Package name mapped to version range.
     */
    readonly [packageName: string]: string;
  };
}
