import { ConvertToBuildableGeneratorSchema } from '../schema';

export interface NormalizedSchema
  extends Omit<ConvertToBuildableGeneratorSchema, 'project'> {
  /**
   * Enable incremental Angular Ivy compilation?
   */
  readonly enableIvy: boolean;
  /**
   * Library import path, for example `@nrwl-airlines/booking/data-access`.
   */
  readonly importPath: string;
  /**
   * Project directory offset from root workspace directory, for example
   * `'../../'`.
   */
  readonly offsetFromRoot: string;
  /**
   * The name of the project.
   */
  readonly projectName: string;
  /**
   * Project root directory.
   */
  readonly projectRoot: string;
  /**
   * Project source directory, for example `libs/shared/util-formatting/src`.
   */
  readonly sourceRoot: string;
  /**
   * Skip formatting files?
   */
  readonly skipFormat: boolean;
}
