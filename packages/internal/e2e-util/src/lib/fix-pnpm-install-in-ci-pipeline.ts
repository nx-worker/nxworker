import { updateFile } from '@nrwl/nx-plugin/testing';

function appendLine(extraLine: string, content: string): string {
  return [content, extraLine].filter(line => line !== '').join('\n');
}

/**
 * Fixes a `pnpm install` issue in CI pipelines because the `--frozen-lockfile`
 * parameter is enabled when the environment has `CI=true`.
 */
export function fixPnpmInstallInCiPipeline() {
  updateFile('.npmrc', content =>
    appendLine('prefer-frozen-lockfile=false', content)
  );
}
