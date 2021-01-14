import { runCommand } from '@nrwl/nx-plugin/testing';

/**
 * Fixes a `pnpm install` issue in CI pipelines because the `--frozen-lockfile`
 * parameter is enabled when the environment has `CI=true`.
 */
export function fixPnpmInstallInCiPipeline() {
  runCommand('"prefer-frozen-lockfile=false" >> .npmrc');
}
