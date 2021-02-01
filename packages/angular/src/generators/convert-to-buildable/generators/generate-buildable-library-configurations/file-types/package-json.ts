/**
 * package.json configuration file in buildable library root directory.
 */
export interface BuildableLibraryPackageJson {
  /**
   * Import path of the buildable library.
   */
  readonly name: string;
  /**
   * Set to `true` to prevent accidental publishing to a package registry.
   */
  readonly private: boolean;
}
