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

