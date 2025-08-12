# Minimal Nx Angular Monorepo

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
npx create-nx-workspace@latest minimal-nx-angular-monorepo \
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

## Make the Angular application zoneless

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
It’s just a record that some of the installed packages declare `zone.js` as a peer dependency.

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
        color: mat.$azure-palette,
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

Finally add some Angular Material components in `app.ts` and `app.html` by copying parts of the
[Angular Material Components](https://material.angular.dev/components/categories) examples.

## Move the generated app to another directory

The application `demapp` that was generated by `npx create-nx-workspace` resides directly under the `apps` directory.
But for more advanced applications the following structure will be used:

```
workspace
│
├── apps
|   |
│   ├── application-A
|   |   |
│   │   ├── client
│   │   └── server
|   |
│   ├── application-B
|   |   |
│   │   ├── clients
│   │   │   ├── cli
│   │   │   ├── desktop
│   │   │   ├── mobile
│   │   │   └── web
│   │   └── server
|   |
|   └── ...
```

Each application is subdivided in multiple subprojects, mostly a `server` and a `client`
like in `application-A` in the above example.
But when there are multiple client interfaces for the application, they are even further subdivided under `clients`
like in `application-B` in the above example.

Moving the project deeper into the hierarchy involves
- Renaming the name of the app from `demoapp` to `demoapp-client` in `project.json`.
- Renaming paths like `apps/demoapp` to `apps/demoapp/client`.
- Renaming path prefixes like `"../../` to `"../../../`.

After this is done, test if everything still works with:
```sh
nx lint demoapp-client
nx test demoapp-client
nx serve demoapp-client
nx build demoapp-client
nx serve-static demoapp-client
```

## Enable I18N for the demoapp

Angular’s built-in `i18n`, `$localize` and `@angular/localize` are still used under Nx.

Install the package:
```sh
npm install @angular/localize --save-dev
```

and refresh `node_modules`
```sh
rm -rf node_modules
rm package-lock.json
npm install
```

### Enable I18N annotations in code

After this, verify if `extract-i18n` works:
```sh
nx extract-i18n demoapp-client
```
It should finish with "Extraction Complete. (Messages: 0)".

Add some `i18n` and `$localize` annotations in the code, for example in `app.ts`:
```ts
readonly i18nMessage = $localize`I18N Translated message`;
```

and in `app.html`
```html
<p i18n>Nice to see you: {{ i18nMessage }} </p>
```

To be able to use `$localize`, the `polyfills` option in `project.json`
under the `build` commands should be set to:
```json
"polyfills": ["@angular/localize/init"]
```
and the `types` option in `tsconfig.app.json` should be set to:
```json
"types": ["@angular/localize"]
```

After this the following tasks should run without errors or warnings:
```sh
nx lint demoapp-client
nx serve demoapp-client
nx build demoapp-client
nx serve-static demoapp-client
nx extract-i18n demoapp-client
```

The only task that does *not* work at this point is `test`. To fix this, insert the following line in `test.setup.ts`:
```ts
import '@angular/localize/init';
```

After that, the `test` task should work too!

### Configure I18N extraction settings

Currently, the command `nx extract-i18n demoapp-client` generates a `messages.xlf` file
in the root directory of the monorepo.

To make sure it is generated in the project directory, convert the following section in `project.json`:
```json
"extract-i18n": {
  "executor": "@angular/build:extract-i18n",
  "options": {
    "buildTarget": "demoapp-client:build"
  }
}
```

to:
```json
"extract-i18n": {
  "executor": "@angular/build:extract-i18n",
  "options": {
    "buildTarget": "demoapp-client:build",
    "outputPath": "apps/demoapp/client/locales",
    "format": "xlf2",
    "outFile": "messages.xlf"
  }
}
```

After this, the command `nx extract-i18n demoapp-client` generates a `messages.xlf` file
in the specified directory under the project.

### Configure multiple Locales

Add the following section to the end of `project.json`, after the complete `targets` section,
just before the final closing `}`:

```json
  "i18n": {
    "sourceLocale": "nl",
    "locales": {
      "en": "apps/demoapp/client/locales/messages.en.xlf"
    }
  }
```

Insert the following under `configurations` -> `production`:
```json
"localize": true,
```

and the following under `configurations` -> `development`:
```json
"localize": false,
```

After this, modify the i18n'ed sources `app.ts` and `app.html`.

Update the source message files `messages.xlf`:
```sh
nx extract-i18n demoapp-client
```

Create the translated file `messages.en.xlf`.

Create a new build and check if it builds for each language:
```sh
nx build demoapp-client
```

### Serve multiple locales during development

For testing the multiple output variants that are generated when I18N is enabled,
the following command can be used:
```sh
nx serve-static demoapp-client
```

If this command fails with a message like:
```sh
ENOENT: no such file or directory, copyfile '<path>/index.html' -> '<path>/404.html'
```
then set the `spa` element to `false` under `serve-static` in `project.json`.
When `spa` is `true` the [tool](https://www.npmjs.com/package/http-server) tries to create a `404.html` which will
be served if a file is not found. This can be used for Single-Page App (SPA) hosting to serve the entry page.
