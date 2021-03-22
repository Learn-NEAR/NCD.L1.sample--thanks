# Sample

This repository includes a complete project structure for AssemblyScript contracts targeting the NEAR platform.

The example here is very basic.  It's a simple contract demonstrating the following concepts:
- a single contract
- the difference between `view` vs. `change` methods
- basic contract storage

The goal of this repository is to make it as easy as possible to get started writing unit and simulation tests for AssemblyScript contracts built to work with NEAR Protocol.

## Usage

### Getting started

1. clone this repo to a local folder
2. run `yarn`
3. run `yarn test`

### Top-level `yarn` commands

- run `yarn test` to run all tests
  - (!) be sure to run `yarn build:release` at least once before:
    - run `yarn test:unit` to run only unit tests
    - run `yarn test:simulate` to run only simulation tests
- run `yarn build` to quickly verify build status
- run `yarn clean` to clean up build folder

### Other documentation

- Sample contract and test documentation
  - see `/src/sample/README` for contract interface
  - see `/src/sample/__tests__/README` for Sample unit testing details

- Sample contract simulation tests
  - see `/simulation/README` for simulation testing


## The file system

Please note that boilerplate project configuration files have been ommitted from the following lists for simplicity.

### Contracts and Unit Tests

```txt
src
├── sample                        <-- sample contract
│   ├── README.md
│   ├── __tests__
│   │   ├── README.md
│   │   └── index.unit.spec.ts
│   └── assembly
│       └── index.ts
└── utils.ts                      <-- shared contract code
```

### Helper Scripts

```txt
scripts
├── 1.init.sh
├── 2.run.sh
└── README.md                     <-- instructions
```
