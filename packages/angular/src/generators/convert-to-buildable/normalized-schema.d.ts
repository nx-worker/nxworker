export interface NormalizedSchema
  extends Exclude<ConvertToBuildableGeneratorSchema, 'project'> {
  /**
   * Enable incremental Angular Ivy compilation?
   */
  readonly enableIvy: boolean;
  /**
   * Library import path, for example `@nrwl-airlines/booking/data-access`.
   */
  readonly importPath: string;
  /**
   * Project folder offset from root workspace folder, for example: `'../../'`.
   */
  readonly offsetFromRoot: string;
  /**
   * The name of the project.
   */
  readonly projectName: string;
  /**
   * Project root folder.
   */
  readonly projectRoot: string;
  /**
   * Skip formatting files?
   */
  readonly skipFormat: boolean;
}
