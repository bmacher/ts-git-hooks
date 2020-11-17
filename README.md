# Git Hooks with Nodejs

Git Hooks written in Nodejs to prevent pushing:
- to master
- with ESLint errors 
- with failing Jest tests

## How to use it?

1. Install the following development dependencies:

```sh
npm install --save-dev \
  typescript \
  ts-node \
  shelljs \
  @types/shelljs \
  eslint \
  @types/eslint \
  jest \
  chalk
```

2. Save [npm-post-install-hook.ts](./scripts/npm-post-install-hook.ts) under *scripts/* and add npm post-install hook to *package.json* that executes the script.

```json
"scripts": {
  "postinstall": "ts-node scripts/npm-post-install-hook.ts",
},
```

3. Add whatever Git Hook you want to apply under *scripts/*.

4. Run `npm install` to install the git hooks.


## How does it work?

Git Hooks are stored in and executed from *scripts/*. The hook scripts are named the following way: `git-<NAME>-hook.ts` and are written in TypeScript. They are executed with *ts-node*. When the projects depdencies are installed (`npm install` or `yarn (install)`) a [npm post install hook](./scripts/npm-post-install-hook.ts) is executed that scans for all git hooks. It then checks whether the hooks are installed and installs them if not. The installation is straight forward:

1. Create hook file under *.git/hooks/\<name\>* 
    - Content: npx ts-node \<path to repo\>/scripts/git-pre-commit-hook.ts "$@"
2. Make file executable (`chmod +x <file>`)

## Findings while creating that repo

### Node

Running **ESLint** programmatically:

```ts
// Install @types/eslint
import eslint from 'eslint';

const linter = new eslint.ESLint({});

const lintResult = linter
  .lintFiles('.')
  .then()
  .catch();
```

Running **Jest** programmatically:

```ts
// Install @types/jest
import * as jest from 'jest';

jest.run(['--silent'])
  .then()
  .catch();
```

### Shell

Use `"$@"` if you want to propagate all arguments to sub command

```sh
#!/bin/bash
ts-node <file> "$@"
```

### Git

Current branch name is stored in *.git/HEAD*.

Get root directory of repository:

```sh
git rev-parse --show-toplevel
```

### NPM

There are hooks for NPM too. To hook just add the same command with  prefix `pre` or `post` to `scripts`.

Example:

```jsonc
{
  "scripts": {
    // Will run after `npm install`.
    "postinstall": "echo \"I am done with installing!\"",
    
    // Will run before `npm test`.
    "pretest": "rm -rf coverage",
    "test": "jest --coverage"
  }
}
```
