/**
 * ng-package.json configuration file in buildable library root directory. Used
 * by ng-packagr for publishable libraries and ng-packagr-lite for buildable
 * libraries.
 */
export interface NgPackageJson {
  /**
   * Relative path referring to the
   * node_modules/ng-packagr/ng-packagr.schema.json JSON schema file.
   */
  readonly $schema: string;
  /**
   * Relative path referring to the project output path, for example
   * `../../../dist/libs/booking/data-access`.
   */
  readonly dest: string;
  /**
   * Library configuration.
   */
  readonly lib: {
    /**
     * Absolute projet path referring to the public API file, for example
     * `src/index.ts`.
     */
    readonly entryFile: string;
  };
}
