## Setting up your terminal

The scripts in this folder support a simple demonstration of the contract.

It uses the following setup:

```txt
┌───────────────────────────────────────┬───────────────────────────────────────┐
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
│                   A                   │                   B                   │
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
│                                       │                                       │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

### Terminal **A**

*This window is used to compile, deploy and control the contract*
- Environment
  ```sh
  export CONTRACT=        # depends on deployment
  export OWNER=           # any account you control

  # for example
  # export CONTRACT=dev-1615190770786-2702449
  # export OWNER=sherif.testnet
  ```

- Commands
  ```sh
  1.init.sh               # cleanup, compile and deploy contract
  2.run.sh                # call methods on the deployed contract
  ```

### Terminal **B**

*This window is used to render the contract account storage*
- Environment
  ```sh
  export CONTRACT=        # depends on deployment

  # for example
  # export CONTRACT=dev-1615190770786-2702449
  ```

- Commands
  ```sh
  # monitor contract storage using near-account-utils
  # https://github.com/near-examples/near-account-utils
  watch -d -n 1 yarn storage $CONTRACT
  ```
---

## OS Support

### Linux

- The `watch` command is supported natively on Linux
- To learn more about any of these shell commands take a look at [explainshell.com](https://explainshell.com)

### MacOS

- Consider `brew info visionmedia-watch` (or `brew install watch`)

### Windows

- Consider this article: [What is the Windows analog of the Linux watch command?](https://superuser.com/questions/191063/what-is-the-windows-analog-of-the-linux-watch-command#191068)
