# Nx setup

See https://nx.dev/getting-started/tutorials/angular-monorepo-tutorial

Install Nx globally:
```sh
npm add --global nx
```

## Create monorepo

Show workspace (monorepo) creation options:
```sh
npx create-nx-workspace@latest --help
```

Create a workspace (monorepo):
```sh
npx create-nx-workspace@latest angular-experiments \
  --preset=angular-monorepo \
  --appName=demoapp \
  --style=sass \
  --skipGit \
  --ssr=false \
  --bundler=esbuild \
  --unitTestRunner=vitest \
  --e2eTestRunner=none
```

## Test initial monorepo

Run the generated `demoapp`:
```sh
nx serve demoapp
```
... and see that it fails with:
```sh
  ✘ [ERROR] Expected newline.
    ╷
  2 │       html {
    │            ^
    ╵
    apps/demoapp/src/app/nx-welcome.ts 2:12  root stylesheet [plugin angular-sass]
```

That is because `--style=sass` was specified when generating the project but the generated app uses `scss`.

"Fix" this by commenting out the complete `<style>` section in `apps/demoapp/src/app/nx-welcome.ts` and retry:

```sh
nx serve demoapp
```

The application can now be viewed at http://localhost:4200/

## Update packages

Update Nx and Angular core packages first:
```sh
nx migrate latest
```

Then run:
```sh
npm install
```

and
```sh
nx migrate --run-migrations
```

After that, notice that some packages have been removed from `package-lock.json`.

## Update Angular packages

Nx migration scripts only upgrade to versions compatible with the Nx version you have installed.

Sometimes the latest Angular version doesn’t have a dedicated Nx migration or isn’t included in the migration metadata yet.

Nx tries to keep your workspace stable by not jumping too far ahead automatically.

So run this command to explicitly install the latest Angular packages:
```sh
npx npm-check-updates -f '/^@angular\//' -u
```

and
```sh
npm install
```

Updating *all* packages at once can easily cause version mismatches,
especially with things like TypeScript, ESLint, or Nx itself.


