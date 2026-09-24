# Web3Beacon

Web3Beacon is a responsive, beginner-friendly guide to the decentralized web. It starts with a plain-language overview, shows how a blockchain, wallet, and smart contract fit together, then explores real uses and tradeoffs. A small MetaMask demo lets visitors try connecting a wallet without signing a message or making a transaction.

The site is built with semantic HTML, CSS, and a small amount of JavaScript. There is no framework or build step.

## What the guide covers

| Concept | How the site explains it |
| --- | --- |
| Decentralization | Shared networks can reduce reliance on a single company's database, but control varies by project. |
| Blockchain | A record maintained by multiple computers; activity on public chains can be inspected. |
| Wallet | A tool for managing an account and approving requests. Recovery phrases must stay private. |
| Smart contract | A program stored on a blockchain that follows its written rules when called. |
| Cryptocurrency | Digital value that can be sent on a blockchain, with variable prices and fees. |
| NFT | A unique token that may link to art, access, or another item; ownership does not automatically grant copyright. |
| DAO | A group that may use shared rules and voting to coordinate decisions or funds. |
| dApp | An application that uses blockchain tools and may work with a wallet across compatible services. |

The Web1/Web2/Web3 comparison is presented as a learning shorthand, not a strict timeline. The guide also covers transaction reversibility, contract bugs, and the difference between connecting a wallet and approving a transaction.

## View the site

Open `index.html` in a browser. For the MetaMask demo, serve the folder locally and open the page in the browser where the MetaMask extension is installed:

```sh
python3 -m http.server 8000
```

Visit `http://localhost:8000`, unlock MetaMask, select **Connect MetaMask**, and review its prompt. On approval, the page shows a shortened public address. It supports EIP-6963 provider discovery and legacy injected providers, account changes, declined requests, and pending requests. The demo never asks for a recovery phrase, signs a message, or moves funds.

Browser extensions may not run on `file://` pages or inside embedded browsers. A live connection requires MetaMask to be enabled in the browser opening the localhost page.

## Checks

```sh
node --check script.js
node --test tests/wallet.test.js
```

The wallet tests simulate provider discovery, connection, rejection, account changes, and a missing extension. A live MetaMask test still needs the extension and a user-approved prompt.

## Files

- `index.html` — page content and structure
- `styles.css` — layout, visual design, and responsive behavior
- `script.js` — optional MetaMask connection
- `web3-network.svg` — custom Web3 network illustration in the hero
- `logo-mark.svg` and `favicon.svg` — Web3Beacon identity
- `tests/wallet.test.js` — wallet interaction checks

This is an educational introduction, not financial advice. Always review wallet requests before approving them.
