# paper-cups

Simple yet powerful RPC client built on top of postMessage.

- Execute both blocking and non-blocking atomic request/response transactions.
- Full type safety and contract validation.
- Automatic event listener cleanup and finalization.
- Fast serialization with support for circular references.
- Built-in logging.

[![Coverage Status](https://coveralls.io/repos/github/MatthewZito/paper-cups/badge.svg?branch=master)](https://coveralls.io/github/MatthewZito/paper-cups?branch=master)
[![Continuous Deployment](https://github.com/MatthewZito/paper-cups/actions/workflows/cd.yml/badge.svg)](https://github.com/MatthewZito/paper-cups/actions/workflows/cd.yml)
[![Continuous Integration](https://github.com/MatthewZito/paper-cups/actions/workflows/ci.yml/badge.svg)](https://github.com/MatthewZito/paper-cups/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/paper-cups.svg)](https://badge.fury.io/js/paper-cups)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Install](#install)
  - [Supported Environments](#support)
- [Documentation](#docs)

## <a name="install"></a> Installation

npm:

```bash
npm install paper-cups
```

yarn:

```bash
yarn add paper-cups
```

pnpm:

```bash
pnpm add paper-cups
```

### <a name="support"></a>  Supported Environments

`paper-cups` currently supports UMD, CommonJS (node versions >= 10), and ESM build-targets

Commonjs:

```js
const { RpcClient } = require('paper-cups');
```

ESM:

```js
import { RpcClient } from 'paper-cups';
```

## <a name="docs"></a> Documentation

Full documentation can be found [here](https://matthewzito.github.io/paper-cups/paper-cups.html)
