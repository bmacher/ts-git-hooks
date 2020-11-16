/**
 * @author Benjamin Macher
 * @description Script checks for git hooks (files with prefix 'git-') and
 * installs them when they aren't installed.
 *
 * @license MIT
 * @copyright by Benjamin Macher 2020
 */

import { resolve } from 'path';
import shell from 'shelljs';

const { info, error } = console;

const rootPath = resolve(__dirname, '..');
const gitHooksPath = resolve(rootPath, '.git/hooks');

function installHookOrThrow(path: string, name: string) {
  info(`Installing: ${name}`);

  const hookPath = resolve(path, name);
  const hookScriptPath = resolve(__dirname, `git-${name}-hook.ts`);

  let { code } = shell.exec(`echo 'npx ts-node ${hookScriptPath} "$@"'> ${hookPath}`);

  if (code !== 0) {
    throw new Error(`Couldn't add ${name} hook`);
  }

  code = shell.exec(`chmod +x ${hookPath}`).code;

  if (code !== 0) {
    throw new Error(`Couldn't make ${name} hook executable`);
  }
}

info('===');
info('POST INSTALL HOOK');

// Get hooks that have a script
const hooks = shell
  .ls(resolve(rootPath, 'scripts'))
  .filter((entry) => entry.slice(0, 4) === 'git-')
  // Extract hook name -> git-<name>-hook.ts
  .map((hook) => hook.slice(4, -8));

info('Checking, whether git hooks are already installed');
const installedHooks = shell.ls(gitHooksPath);
const toBeInstalledHooks: string[] = [];

for (const hook of hooks) {
  if (installedHooks.includes(hook)) {
    info(`  ✅ ${hook}`);
  } else {
    info(`  ❌ ${hook}`);
    toBeInstalledHooks.push(hook);
  }
}

info('');

if (toBeInstalledHooks.length > 0) {
  for (const hook of toBeInstalledHooks) {
    try {
      installHookOrThrow(gitHooksPath, hook);
    } catch (err) {
      error(`Error: ${(<Error>err).message}\n`);

      error(`❌ Coundn't install ${hook}, please run scripts/npm-post-install-hook.ts manually and make sure that it runs through.`);
      info('To execute run: npx ts-node scripts/npm-post-install-hook.ts');

      shell.exit(1);
    }
  }
}

info('\n✅ Done!');
