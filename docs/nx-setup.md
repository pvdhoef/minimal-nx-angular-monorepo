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

and refresh `node_modules`
```sh
rm -rf node_modules
rm package-lock.json
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

and refresh `node_modules`
```sh
rm -rf node_modules
rm package-lock.json
npm install
```

Updating *all* packages at once can easily cause version mismatches,
especially with things like TypeScript, ESLint, or Nx itself.

## Convert the application to a zoneless application

Modify `apps/demoapp/src/app/app-config.ts`:

- Replace `provideZoneChangeDetection`
- with `provideZonelessChangeDetection`.

After that, the file should look as follows:
```ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
  ],
};
```

Modify `project.json`:

Remove the reference to `zone.js`

- from `"polyfills": ["zone.js"]`
- to `"polyfills": []`.

Afterwards uninstall `zone.js`:

```sh
npm uninstall zone.js
```

and refresh `node_modules`
```sh
rm -rf node_modules
rm package-lock.json
npm install
```

After that, there will still be some references to `zone.js` in `package-lock.json`. This isn't problematic.
It’s just a record that one of the installed packages declares `zone.js` as a peer dependency.

## Delete the 'NxWelcome' component

Delete the file `apps/demoapp/src/app/nx-welcome.ts` and all references to it (`NxWelcome`, `<app-nx-welcome>`).

Instead of the `<app-nx-welcome>` element insert `<h1>Welcome demoapp</h1>` in `apps/demoapp/src/app/app.html`.

## Run automated tests

Run the tests for the `demoapp` project:
```sh
nx test demoapp
```

... and see that it fails.

The test runner setup is still configured for Angular’s default `zone.js`-based testing, so even though
the app is zoneless, the testing environment is trying to load `zone.js` before running any specs.

To solve this, reinstall `zone.js` as a dev dependency so the test bootstrap works,
while your the runtime remains zoneless.
```sh
npm install -D zone.js
```

and refresh `node_modules`
```sh
rm -rf node_modules
rm package-lock.json
npm install
```

The `-D` flag on `npm install` makes sure that `zone.js` will be added under`devDependencies` only.

After this, the test succeeds! It correctly finds `<h1>Welcome demoapp</h1>` in `app.html`.

## Add Angular Material

Manually install the Angular Material packages.

Run this in the workspace root:

```sh
npm install @angular/material @angular/cdk @angular/animations
```

and refresh `node_modules`
```sh
rm -rf node_modules
rm package-lock.json
npm install
```

This adds the specified packages to `package.json`.

Add the following to `styles.sass`:
```sass
@use '@angular/material' as mat

html
    color-scheme: light
    @include mat.theme((
        // Available color palettes:
        //
        // color: mat.$red-palette,
        // color: mat.$green-palette,
        // color: mat.$blue-palette,
        // color: mat.$yellow-palette,
        // color: mat.$cyan-palette,
        // color: mat.$magenta-palette,
        // color: mat.$orange-palette,
        // color: mat.$chartreuse-palette,
        // color: mat.$spring-green-palette,
        color: mat.$azure-palette, // This one looks the best.
        // color: mat.$violet-palette,
        // color: mat.$rose-palette,
        typography: Roboto,
        density: 0
    ))
```

Run `nx serve demoapp` if everything still works and change the `color-scheme` form `light` to `dark` to see if it works.

Add fonts to `index.html`.

Insert these lines inside the `<head>` tag:
```html
<!-- Roboto font, note the newer Google Fonts v2 API (css2) -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">

<!-- Material Icons -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

To check if it works, add the following rule to `styles.sass`:
```sass
body, p
    font: var(--mat-sys-body-medium)
```

# TODO:
- Add I18N.

