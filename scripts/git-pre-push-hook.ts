/**
 * Script is executed before 'git push' and prevents:
 *   - pushing to master branch
 *   - pushing with ESLint errors
 *   - pushing with failing jest tests
 */

import { resolve } from 'path';
import { readFileSync } from 'fs';
import shell from 'shelljs';
import eslint from 'eslint';
import * as jest from 'jest';

const { info, error } = console;

const rootPath = resolve(__dirname, '..');

// Need to wrap whole hook into function to get async/await
async function gitPrePushHook() {
  // #region Prevent pushing to master
  info('Checking for current branch');
  const gitHeadContent = readFileSync(resolve(rootPath, '.git/HEAD'));

  const branch = gitHeadContent
    .toString()
    .trim()
    .replace('ref: refs/heads/', '');

  info(branch);

  if (branch === 'master') {
    error('❌ You are not allowed to push directly into master!');
    info('Please use Pull Requests to update master branch.\n');

    shell.exit(1);
  }

  info('✅ Branch is not master');
  // #endregion

  // #region Prevent pushing with ESLint errors
  info('\nLinting the code');
  const linter = new eslint.ESLint({});

  const lintResult = await linter
    .lintFiles(rootPath)
    // .then(() => { throw new Error('ff'); })
    .catch((err) => {
      error(err);
      error('❌ Executing eslint failed. Make sure that it runs properly!');
      info('To execute run: npm run lint OR npx eslint .');

      shell.exit(1);
    });

  const filesWithError = lintResult.filter(({ errorCount }) => errorCount > 0).length;

  if (filesWithError > 0) {
    error(`❌ You are not allowed to push with ${filesWithError} file${filesWithError > 1 ? 's' : ''} having ESLint errors!`);
    info('To see the error run: npm run lint OR npx eslint .');

    shell.exit(1);
  }

  info('✅ ESLint succeeded');
  // #endregion

  // #region Prevent pushing with jest failing tests
  info('\nRunning tests');

  await jest.run(['--silent']).catch((err) => {
    error(err);
    error('❌ Executing jest failed. Make sure that it runs properly!');
    info('To execute run: npm run test OR npx jest');

    shell.exit(1);
  });

  info('✅ All tests succeeded');
  // #endregion

  info();
}

gitPrePushHook();
