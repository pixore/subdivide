# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.6](https://github.com/pixore/subdivide/compare/v0.1.5...v0.1.6) (2022-04-28)


### Bug Fixes

* **init-state:** support containers without directionType ([2416e2f](https://github.com/pixore/subdivide/commit/2416e2f248f42de8466666a10baf45a856f8ca9c))

### [0.1.5](https://github.com/pixore/subdivide/compare/v0.1.4...v0.1.5) (2022-04-28)

### [0.1.4](https://github.com/pixore/subdivide/compare/v0.1.3...v0.1.4) (2022-04-28)


### Features

* update dependencies and fix types ([794729c](https://github.com/pixore/subdivide/commit/794729c480d627c044098db2cc27406a5a4aea2a))
* update minor version, update parcel and fix type issues ([c9c746c](https://github.com/pixore/subdivide/commit/c9c746cb1309c59136d6e952db62f334fba418e2))

### [0.1.3](https://github.com/pixore/subdivide/compare/v0.1.2...v0.1.3) (2021-06-03)

### [0.1.2](https://github.com/pixore/subdivide/compare/v0.1.1...v0.1.2) (2020-07-02)

### [0.1.1](https://github.com/pixore/subdivide/compare/v0.1.0...v0.1.1) (2020-07-02)

## [0.1.0](https://github.com/pixore/subdivide/compare/v0.0.9...v0.1.0) (2020-03-08)


### ⚠ BREAKING CHANGES

* **exports:** Config is not exported anymore | useConfig and useClassNames are exported directly

### Bug Fixes

* **types:** fix typescript config to build type files ([265a601](https://github.com/pixore/subdivide/commit/265a6012b612b325c44e79b9981b6840de9dc9a9))


* **exports:** change Config.Provider to ConfigProvider ([34577fd](https://github.com/pixore/subdivide/commit/34577fdc9cf4309f6a554c85d2748f051e0f50ea))

### [0.0.9](https://github.com/pixore/subdivide/compare/v0.0.8...v0.0.9) (2020-03-08)


### Bug Fixes

* **merge:** consider position of the layout to check the merge ([db1a3b5](https://github.com/pixore/subdivide/commit/db1a3b51c2c6df606b1fc01b29539a89cd5fc062))
* **resize:** fix the last update size after a resize ([f584962](https://github.com/pixore/subdivide/commit/f58496217e5ff637052ac80028513f2320ca4ca9))

### [0.0.8](https://github.com/pixore/subdivide/compare/v0.0.7...v0.0.8) (2019-12-10)


### Features

* **split:** clone container state when spliting ([aaea6db](https://github.com/pixore/subdivide/commit/aaea6dba65a64aa33773a3e7202b9e585e043da8))

### [0.0.7](https://github.com/pixore/subdivide/compare/v0.0.6...v0.0.7) (2019-12-07)


### Features

* **position:** add selfPosition prop ([0fc01ae](https://github.com/pixore/subdivide/commit/0fc01aebba484c740a64878f10d25550f04eee0e))


### Bug Fixes

* **size:** fix size when using custom position ([c708af1](https://github.com/pixore/subdivide/commit/c708af13c181f15e4d7b2b61419c2f4aa70c4bc5))

### [0.0.6](https://github.com/pixore/subdivide/compare/v0.0.5...v0.0.6) (2019-11-30)


### Bug Fixes

* **container:** wait to update the stats ([7beaa69](https://github.com/pixore/subdivide/commit/7beaa69af1fcee4238171ec2e98717da1a404822))

### 0.0.5 (2019-11-30)


### Features

* **config:** support custom initialState ([0129c40](https://github.com/pixore/subdivide/commit/0129c4098d6aa6cb2c2c1beefd7307f208f26a1f))
* **container:** create container utils ([e1cd68a](https://github.com/pixore/subdivide/commit/e1cd68af217b616670dd426a783942ec1e12e36c))
* **container:** provide stats about the container ([3b8d812](https://github.com/pixore/subdivide/commit/3b8d81206f0288e883ff4b7544155bd7a02d315e))
* **container:** support custom state for each container ([265516a](https://github.com/pixore/subdivide/commit/265516a96920d48136826721e0f7a97bd80a6892))
* **general:** create basic subdivide system ([7cacbc8](https://github.com/pixore/subdivide/commit/7cacbc81fca4295fdc5fd1442710241d956d3d86))
* **hooks:** Stop using useState, instead use useReducer  ([6b0096c](https://github.com/pixore/subdivide/commit/6b0096c504b0cac7e4c62f083a282386f4552969))
* **id:** create id utils ([f1157b3](https://github.com/pixore/subdivide/commit/f1157b342d25fc95a9af6e530915a4cda37fe12f))
* **ids:** check for used ids ([f56a76f](https://github.com/pixore/subdivide/commit/f56a76f8029155f194c05f4cef2f50a7e7b7f307))
* **layout:** create layout reducer ([131f54e](https://github.com/pixore/subdivide/commit/131f54e42c7d1f32e6133b2365742326ef9d02fa))
* **layout:** generate dividers ([52c50a1](https://github.com/pixore/subdivide/commit/52c50a1f3cd1892d6939eeb1b0ba91cc4ae01a49))
* **layout:** implement custom initial state ([f8658a2](https://github.com/pixore/subdivide/commit/f8658a255076db9e01e370768bc0473b7f5ead68))
* **layout:** stop using window size directly ([ce2fe2b](https://github.com/pixore/subdivide/commit/ce2fe2bf53702380ebb44d712b5444ef26494fba))
* **layout:** support custom initial state ([4e4cf1b](https://github.com/pixore/subdivide/commit/4e4cf1b345ab448bfd91e20bc358d4ef3556b937))
* **layout:** support custom position and size ([66827b2](https://github.com/pixore/subdivide/commit/66827b239a771c0d4c23041def4d5318ece98aee))
* **layout:** support custom size and position ([c4ecfff](https://github.com/pixore/subdivide/commit/c4ecfff7fc172533d6fc351464962f2bbd5887aa))
* **list:** create list utils ([983acf3](https://github.com/pixore/subdivide/commit/983acf329442fe372a991fac388cdce919e1d6f9))
* **merge:** add basic merge implementation ([57318b6](https://github.com/pixore/subdivide/commit/57318b6a301d24bff9e2876a5e33def5e083e496))
* **merge:** create overlay component ([75ca75b](https://github.com/pixore/subdivide/commit/75ca75b0e2d0a8246d972604d208f8c610a1767e))
* **merge:** merge until the drag is ended ([f17210f](https://github.com/pixore/subdivide/commit/f17210f168cc67e682f8e51acee200fe72f1a27a))
* **merge:** show merge indication using an overlay ([7180817](https://github.com/pixore/subdivide/commit/7180817c6a7281e9f3cb2c88cc1a0867d1d03a84))
* **merge:** support vertical merge ([a85b57e](https://github.com/pixore/subdivide/commit/a85b57e7e04309f8b3399fd55b23f3a27d619360))
* **overlay:** create arrow generator ([32548e0](https://github.com/pixore/subdivide/commit/32548e0c42f596bcef03d3c8c1bb36977d0f03af))
* **percentage:** create percentage utils ([2bc88bf](https://github.com/pixore/subdivide/commit/2bc88bffeb7f4865f7f754ef40b1b4e493ec6be7))
* **render:** avoid unnecessary render for users ([9037244](https://github.com/pixore/subdivide/commit/90372440e8a4a70f927f6e6d315bdcc4f433c4ea))
* **resize:** use throttle when resizing ([c1af064](https://github.com/pixore/subdivide/commit/c1af06405b29bdd063692e654394f8ab3ca4ba06))
* **styles:** add essential styles in the components ([3e52b50](https://github.com/pixore/subdivide/commit/3e52b508d1ac4298c38b0539a0ff6dcd16bbf9af))
* **utils:** create array utils ([7a6253f](https://github.com/pixore/subdivide/commit/7a6253f9a6ddb85c0aa17914fcf842fad5606211))
* **utils:** create throttle function ([25d0f33](https://github.com/pixore/subdivide/commit/25d0f331f7151d5366957911a97961bdab0b9b7e))
* **vector:** add sustract function ([94cb5a9](https://github.com/pixore/subdivide/commit/94cb5a9ac4330074170b72d94c58a72a01af6d19))
* **vector:** add util functions ([c594019](https://github.com/pixore/subdivide/commit/c5940192cbd1efbd60a838896368e01db165271c))
* **vector:** create invert function ([974dbdb](https://github.com/pixore/subdivide/commit/974dbdb622dd7372a53fd9cf6e7cb1c8c82f1d6c))
* **vector:** create Vector type ([8eecb0c](https://github.com/pixore/subdivide/commit/8eecb0cdd897ab8ad58a6b8cc9564379a6d401ec))


### Bug Fixes

* **example:** fix typo ([d92b8fa](https://github.com/pixore/subdivide/commit/d92b8fa6e6a13eb6b8fa638c2fbdcbb4eb9496da))
* **example:** fix typo ([746b300](https://github.com/pixore/subdivide/commit/746b300cab50cc860dabaac0d06c1074c66d89b9))
* **ids:** check for used ids ([95de185](https://github.com/pixore/subdivide/commit/95de1854ada3ad2ee9c612be24ad62ebd3590359))
* **imports:** fix react imports ([f224f65](https://github.com/pixore/subdivide/commit/f224f652bed400b4f467e12d8f5687985d057f6f))
* **layout:** update top and left correctly ([1b6fc85](https://github.com/pixore/subdivide/commit/1b6fc8528b62b4361be9629cb13fa5b59d299125))
* **merge:** avoid merge to group containers ([83a30b7](https://github.com/pixore/subdivide/commit/83a30b7a6f0b6bf52a4a562532b02ffb3e0fe3cc))
* **resize:** check size and position ([cb21254](https://github.com/pixore/subdivide/commit/cb21254c744f433c4b1e38bd4ccc319356d6772e))
* **split:** fix left and up split directions ([f4867d1](https://github.com/pixore/subdivide/commit/f4867d19cc4541a46aa835d5bbd4fde357fb5df5))
* **typo:** fix typo ([26e6f82](https://github.com/pixore/subdivide/commit/26e6f826699fe283c36db6098f44581d841337e5))
