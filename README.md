<h1 align="center">Welcome to @pixore/subdivide 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/npm/v/@pixore/subdivide" />
  <a href="https://github.com/pixore/subdivide#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/pixore/subdivide/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/pixore/subdivide/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/pixore/@pixore/subdivide" />
  </a>
  <a href="https://twitter.com/pixore_io" target="_blank">
    <img alt="Twitter: pixore_io" src="https://img.shields.io/twitter/follow/pixore_io.svg?style=social" />
  </a>
</p>

> Layout system inspired by blender's subdivide layout using [React.js](https://reactjs.org/)

Table of content:

- [Introduction](./README.md#introduction)
- [Usage](./README.md#usage)
- [Installation](./README.md#installation)
- [Basic Usage](./README.md#basic-usage)
- [Preservable Layout](./README.md#preservable-layout)
- [Api](./README.md#api)

## Introduction

Subdivide is based on the layout system created for [Blender](https://docs.blender.org/manual/en/latest/interface/window_system/areas.html), in which every **area** can be split into more areas or be merged with a sibling area.

## Installation

```sh
npm install @pixore/subdivide
```

## Basic Usage

```jsx
import React from 'react';
import { render } from 'react-dom';

import Subdivide from '@pixore/subdivide';

const MasterPanel = () => <span>hello world!</span>;

const App = () => {
  return <Subdivide component={MasterPanel} />;
};

render(<App />, document.getElementById('root'));
```

> Note the **MasterPanel** component, usually, this component should be able to turn into any other panel using a select input or a similar mechanism.

And that's it! You can check more examples in the [examples folder](./examples)

## Preservable Layout

The layout is described by a simple object, it can be serializable and use it as the initial state a preservable layout can be achievable:

```jsx
import React from 'react';
import { render } from 'react-dom';
import Subdivide, {
  ConfigProvider,
  useContainer,
  LayoutState,
} from '../../src';

const MasterPanel = () => <span>Just like you leave it :)</span>;

const getInitialState = () => {
  try {
    const json = localStorage.getItem('state');
    return JSON.parse(json);
  } catch (error) {
    return undefined;
  }
};

const initialState = getInitialState();

const App = () => {
  const onLayoutChange = (state) => {
    localStorage.setItem('state', JSON.stringify(state));
  };

  return (
    <ConfigProvider initialState={initialState} onLayoutChange={onLayoutChange}>
      <Subdivide component={MasterPanel} />
    </ConfigProvider>
  );
};

render(<App />, document.getElementById('root'));
```

## Api

### Components

#### [Subdivide](./src/components/Subdivide.tsx)

| Prop         | Type            | Defalt Value |
| ------------ | --------------- | ------------ |
| component    | React.ReactNode | n/a          |
| width        | number          | 100%         |
| height       | number          | 100%         |
| top          | number          | 0            |
| left         | number          | 0            |
| selfPosition | boolean         | true         |

#### ConfigProvider alias of [Config.Provider](./src/contexts/Config.tsx)

| Prop           | Type                   | Defalt Value |
| -------------- | ---------------------- | ------------ |
| initialState   | State                  |              |
| onLayoutChange | (state: State) => void |              |
| classNames     | OptionalClassNames     |              |
| cornerSize     | number                 |              |
| splitRatio     | number                 |              |

### Hooks

#### [useContainer](./src/components/Container.tsx)

Use to access to the container data, and update its state. Check how it's used in the examples: [ColorPane](./examples/components/ColorPane.tsx), [preservable](./examples/screens/preservable.tsx), [stats](./examples/screens/stats.tsx)

#### [useConfig](./src/contexts/Config.tsx)

> Mostly for internal usage

#### [useClassNames](./src/contexts/Config.tsx)

> Mostly for internal usage

## Author

👤 **Jose Albizures** by Pixore

- Twitter: [@\albzrs](https://twitter.com/albzrs), [@pixore_io](https://twitter.com/pixore_io)
- Github: [@albizures](https://github.com/albizures), [@pixore](https://github.com/pixore)

## 🙏 Thanks!

- to Blender for inspiring this layout system
- to [subdivide](https://github.com/philholden/subdivide) by [@philholden](https://github.com/philholden) which is an alternative to this library in case you are using redux.
- to [svelte-subdivide](https://github.com/sveltejs/svelte-subdivide) by [@Rich-Harris](https://github.com/Rich-Harris)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/pixore/subdivide/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Jose Albizures](https://github.com/pixore).<br />
This project is [MIT](https://github.com/pixore/subdivide/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
