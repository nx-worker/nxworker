import { ProjectConfiguration } from '@nrwl/devkit';

import { ConvertToIncrementalServeGeneratorSchema } from '../schema';

export interface NormalizedSchema
  extends Omit<ConvertToIncrementalServeGeneratorSchema, 'project'> {
  /**
   * Enable incremental Angular Ivy compilation?
   */
  readonly enableIvy: boolean;
  /**
   * Project directory offset from root workspace directory, for example
   * `'../../'`.
   */
  readonly offsetFromRoot: string;
  /**
   * The full configuration of the project.
   */
  readonly projectConfiguration: ProjectConfiguration;
  /**
   * The name of the project.
   */
  readonly projectName: string;
  /**
   * Project root directory, for example `libs/shared/util-formatting`.
   */
  readonly projectRoot: string;

  /**
   * Skip formatting files?
   */
  readonly skipFormat: boolean;
  /**
   * Project source directory, for example `libs/shared/util-formatting/src`.
   */
  readonly sourceRoot: string;
}
