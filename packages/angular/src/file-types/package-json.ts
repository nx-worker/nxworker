/**
 * package.json configuration file in workspace root directory.
 */
export interface WorkspaceRootPackageJson {
  /**
   * Workspace scripts.
   */
  readonly scripts?: {
    /**
     * Script name mapped to local command.
     */
    readonly [scriptName: string]: string;
  };
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
