import { PackageManager, WorkspaceConfiguration } from './types';
import { updateJsonFile } from './update-json-file';

/**
 * Configure the package manager for the e2e workspace.
 *
 * NOTE! This must be called **after** `ensureNxProject`.
 */
export function usePackageManager(packageManager: PackageManager) {
  updateJsonFile('workspace.json', (workspaceJson: WorkspaceConfiguration) => ({
    ...workspaceJson,
    cli: {
      defaultCollection:
        workspaceJson.cli?.defaultCollection ?? '@nrwl/angular',
      packageManager,
    },
  }));
}
