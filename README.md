# postmessage-rpc

Simple yet powerful RPC client built on top of postMessage.

- Execute both blocking and non-blocking atomic request/response transactions.
- Full type safety and contract validation.
- Automatic cleanup and finalization.
- Fast serialization with support for circular references.
- Builtin logging.

[![Coverage Status](https://coveralls.io/repos/github/MatthewZito/postmessage-rpc/badge.svg?branch=master)](https://coveralls.io/github/MatthewZito/postmessage-rpc?branch=master)
[![Continuous Deployment](https://github.com/MatthewZito/postmessage-rpc/actions/workflows/cd.yml/badge.svg)](https://github.com/MatthewZito/postmessage-rpc/actions/workflows/cd.yml)
[![Continuous Integration](https://github.com/MatthewZito/postmessage-rpc/actions/workflows/ci.yml/badge.svg)](https://github.com/MatthewZito/postmessage-rpc/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/postmessage-rpc.svg)](https://badge.fury.io/js/postmessage-rpc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Install](#install)
  - [Supported Environments](#support)
- [Documentation](#docs)

## <a name="install"></a> Installation

npm:

```bash
npm install postmessage-rpc
```

yarn:

```bash
yarn add postmessage-rpc
```

pnpm:

```bash
pnpm add postmessage-rpc
```

### <a name="support"></a>  Supported Environments

`postmessage-rpc` currently supports UMD, CommonJS (node versions >= 10), and ESM build-targets

Commonjs:

```js
const { RpcClient } = require('postmessage-rpc');
```

ESM:

```js
import { RpcClient } from 'postmessage-rpc';
```

## <a name="docs"></a> Documentation

Full documentation can be found [here](https://matthewzito.github.io/postmessage-rpc/postmessage-rpc.html)
