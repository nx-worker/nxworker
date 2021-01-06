export interface FileTemplateReplacements {
  /**
   * Whether the production build is compiled with Ivy. This speeds up
   * incremental build.
   */
  readonly enableIvy: boolean;
  /**
   * Library import path, for example `@nrwl-airlines/booking/data-access`.
   */
  readonly importPath: string;
  /**
   * Project directory offset from root workspace directory, for example: `'../../'`.
   */
  readonly offsetFromRoot: string;
  /**
   * Project root directory.
   */
  readonly projectRoot: string;
  /**
   * Template files have the `__template__` suffix which will be removed when
   * this is set.
   */
  readonly template: '';
}
