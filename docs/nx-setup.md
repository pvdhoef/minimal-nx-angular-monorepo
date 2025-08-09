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


