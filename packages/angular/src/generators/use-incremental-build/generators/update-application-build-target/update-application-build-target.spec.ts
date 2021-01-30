// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addAngularApplication, createProjectName } from '@internal/test-util';
import { readProjectConfiguration, TargetConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { NormalizedSchema, normalizeOptions } from '../../util';
import { incrementalBuildExecutor } from './executors';
import { updateApplicationBuildTarget } from './update-application-build-target';

function readBuildTarget(
  host: Tree,
  projectName: string
): TargetConfiguration | undefined {
  return readProjectConfiguration(host, projectName).targets.build;
}

function removeBuildTarget(host: Tree, projectName: string): void {
  const project = readProjectConfiguration(host, projectName);

  delete project.targets.build;

  updateProjectConfiguration(host, projectName, project);
}

function useBuildExecutor(
  executor: string,
  host: Tree,
  projectName: string
): void {
  const project = readProjectConfiguration(host, projectName);

  project.targets.build = {
    executor: incrementalBuildExecutor,
  };

  updateProjectConfiguration(host, projectName, project);
}

describe(updateApplicationBuildTarget.name, () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    const name = 'feature-seat-listing';
    const directory = 'seatmap';
    projectName = createProjectName({
      directory,
      name,
    });
    addAngularApplication(host, {
      directory,
      name,
    });
    options = normalizeOptions(host, {
      project: projectName,
    });
  });

  let host: Tree;
  let options: NormalizedSchema;
  let projectName: string;

  it('configures the incremental build executor when the application configuration is valid', () => {
    const initialBuildTarget = readBuildTarget(host, projectName);
    const expectedBuildTarget: TargetConfiguration = {
      ...initialBuildTarget,
      executor: '@nrwl/angular:webpack-browser',
    };

    updateApplicationBuildTarget(host, options);

    const actualBuildTarget = readBuildTarget(host, projectName);
    expect(actualBuildTarget).toEqual(expectedBuildTarget);
  });

  describe('when the application configuration has no build target', () => {
    beforeEach(() => {
      removeBuildTarget(host, projectName);
      options = normalizeOptions(host, {
        project: projectName,
      });
    });

    it('does not add a build target', () => {
      updateApplicationBuildTarget(host, options);

      const actualBuildTarget = readBuildTarget(host, projectName);
      expect(actualBuildTarget).toBeUndefined();
    });

    it('outputs a warning', () => {
      const warnSpy = spyOn(console, 'warn');

      updateApplicationBuildTarget(host, options);

      expect(warnSpy).toHaveBeenCalledTimes(1);
      const warnMessage = warnSpy.calls.mostRecent().args[0];
      expect(warnMessage).toContain('Skipping...');
    });
  });

  describe('when the application uses incremental build', () => {
    beforeEach(() => {
      useBuildExecutor(incrementalBuildExecutor, host, projectName);
      options = normalizeOptions(host, {
        project: projectName,
      });
    });

    it('outputs an info message', () => {
      const infoSpy = spyOn(console, 'info');

      updateApplicationBuildTarget(host, options);

      expect(infoSpy).toHaveBeenCalledTimes(1);
      const infoMessage = infoSpy.calls.mostRecent().args[0];
      expect(infoMessage).toContain('Skipping...');
    });
  });

  describe('when the application uses an unknown build executor', () => {
    beforeEach(() => {
      useBuildExecutor('@test/executor:run', host, projectName);
      options = normalizeOptions(host, {
        project: projectName,
      });
    });

    it('outputs an error message', () => {
      const infoSpy = spyOn(console, 'info');

      updateApplicationBuildTarget(host, options);

      expect(infoSpy).toHaveBeenCalledTimes(1);
      const infoMessage = infoSpy.calls.mostRecent().args[0];
      expect(infoMessage).toContain('Skipping...');
    });
  });
});
