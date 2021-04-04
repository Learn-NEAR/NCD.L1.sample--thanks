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

  _Owner scripts_
  ```sh
  1.dev-deploy.sh         # cleanup, compile and deploy contract
  o-report.sh             # generate a summary report of the contract state
  o-transfer.sh           # transfer received funds to the owner account
  ```

  _Public scripts_
  ```sh
  2.say-thanks.sh         # post a message saying thank you, optionally attaching NEAR tokens
  2.say-anon-thanks.sh    # post an anonymous message (otherwise same as above)
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

- Consider this article: [What is the Windows analog of the Linux watch command?](https://superuser.com/questions/191063/what-is-the-windows-analog-of-the-linuo-watch-command#191068)
