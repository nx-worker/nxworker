import { ProjectConfiguration } from '@nrwl/devkit';

import { UseIncrementalBuildGeneratorSchema } from '../schema';

export interface NormalizedSchema
  extends Omit<UseIncrementalBuildGeneratorSchema, 'project'> {
  /**
   * The full configuration of the project.
   */
  readonly projectConfiguration: ProjectConfiguration;
  /**
   * The name of the project.
   */
  readonly projectName: string;
  /**
   * Skip formatting files?
   */
  readonly skipFormat: boolean;
}
