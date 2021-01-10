import { ProjectConfiguration } from '@nrwl/devkit';

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
   * The type of the project.
   */
  readonly projectType: 'application' | 'library';
  /**
   * Skip formatting files?
   */
  readonly skipFormat: boolean;
  /**
   * Project source directory, for example `libs/shared/util-formatting/src`.
   */
  readonly sourceRoot: string;
}
