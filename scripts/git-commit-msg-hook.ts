/**
 * @author Benjamin Macher
 * @description Script verifies commit messages.
 *
 * @license MIT
 * @copyright by Benjamin Macher 2020
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const { info, error } = console;

const rootPath = resolve(__dirname, '..');

const maxMsgLength = 50;
const commitRE = new RegExp(`^(revert: )?(feat|fix|docs|refactor|test|chore|wip|style|tooling)(\\(.+\\))?: .{1,${maxMsgLength}}`);

// First two arguments are path to ts-node and path to script
const [,,msgPath] = process.argv;

const msg = readFileSync(resolve(rootPath, msgPath))
  .toString()
  .trim();

info('Checking commit message');

if (!commitRE.test(msg)) {
  info();

  let errorMsg = 'Error: invalid commit message format.\n\n';
  errorMsg += '    A propper commit message would look like this:\n\n';
  errorMsg += '    feat(package-a): add a feature\n';
  errorMsg += '    fix(package-b): error (close: #123)\n';

  error(errorMsg);

  process.exit(1);
}

info('✅ Correct message format');
