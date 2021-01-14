import { updateFile } from '@nrwl/nx-plugin/testing';

/**
 * Fixes a `pnpm install` issue in CI pipelines because the `--frozen-lockfile`
 * parameter is enabled when the environment has `CI=true`.
 *
 * NOTE! Must be called in a `beforeEach` hook.
 */
export function fixPnpmInstallInCiPipeline() {
  updateFile('.npmrc', 'prefer-frozen-lockfile=false');
}
