# pm-rpc

Simple yet powerful RPC client built on top of postMessage.

- Execute both blocking and non-blocking atomic request/response transactions.
- Full type safety and contract validation.
- Automatic cleanup and finalization.
- Fast serialization with support for circular references.
- Builtin logging.

[![Coverage Status](https://coveralls.io/repos/github/MatthewZito/pm-rpc/badge.svg?branch=master)](https://coveralls.io/github/MatthewZito/pm-rpc?branch=master)
[![Continuous Deployment](https://github.com/MatthewZito/pm-rpc/actions/workflows/cd.yml/badge.svg)](https://github.com/MatthewZito/pm-rpc/actions/workflows/cd.yml)
[![Continuous Integration](https://github.com/MatthewZito/pm-rpc/actions/workflows/ci.yml/badge.svg)](https://github.com/MatthewZito/pm-rpc/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/pm-rpc.svg)](https://badge.fury.io/js/pm-rpc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Install](#install)
  - [Supported Environments](#support)
- [Documentation](#docs)

## <a name="install"></a> Installation

npm:

```bash
npm install pm-rpc
```

yarn:

```bash
yarn add pm-rpc
```

pnpm:

```bash
pnpm add pm-rpc
```

### <a name="support"></a>  Supported Environments

`pm-rpc` currently supports UMD, CommonJS (node versions >= 10), and ESM build-targets

Commonjs:

```js
const { RpcClient } = require('pm-rpc');
```

ESM:

```js
import { RpcClient } from 'pm-rpc';
```

## <a name="docs"></a> Documentation

Full documentation can be found [here](https://matthewzito.github.io/pm-rpc/pm-rpc.html)
