import { WorkspaceConfiguration as NxWorkspaceConfiguration } from '@nrwl/devkit';

import { PackageManager } from './package-manager';

export interface WorkspaceConfiguration extends NxWorkspaceConfiguration {
  cli?: {
    defaultCollection: string;
    packageManager: PackageManager;
  };
}
