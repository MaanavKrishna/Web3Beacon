# Common Ground

Common Ground is a responsive, beginner-friendly field guide to Web3. It explains the vocabulary first, then gives concrete examples of how people use shared networks. The site uses HTML, CSS, and a small amount of JavaScript for the optional MetaMask connection. No build step or account is required to read it.

## Web3 concepts covered

- **Decentralization:** Some online services can run on shared networks rather than relying on one company to keep the records.
- **Blockchain:** A record maintained by multiple computers. Public blockchains make transactions and program activity verifiable.
- **Wallets:** Tools for managing blockchain accounts and signing requests. A wallet connection does not require buying anything.
- **Smart contracts:** Programs stored on a blockchain that execute their written rules when invoked.
- **Cryptocurrencies:** Digital assets that can be transferred on blockchain networks. Their prices and transaction fees can vary.
- **NFTs:** Unique tokens that can be linked to art, access, or other items. Owning a token does not automatically grant copyright or other rights to the linked item.
- **DAOs:** Online groups that can use shared rules and voting to coordinate decisions.
- **dApps:** Applications that interact with blockchain networks; some allow a wallet or digital items to work across compatible services.

## View the site

Open `index.html` in a browser to read the page. The layout adapts to desktop, tablet, and mobile widths. It includes keyboard focus styles, a skip link, semantic sections, and reduced-motion support.

## Optional wallet connection

To test with the MetaMask browser extension, serve the folder locally and open the local address **in the browser where MetaMask is installed**:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`, unlock MetaMask, and select **Connect MetaMask**. Approving the request shares your public account address with the page. The page displays a shortened address and responds to account changes. It discovers MetaMask through EIP-6963 when available, then checks legacy injected providers. If MetaMask is unavailable or a request is declined, it shows a clear message. It never asks for a recovery phrase, signs a transaction, or sends funds.

Browser extensions may not run on `file://` pages or inside embedded browsers. A successful connection requires MetaMask to be enabled in the browser that opens the localhost page.

Run the wallet interaction checks with `node --test tests/wallet.test.js`. They simulate provider discovery, connection, rejection, account changes, and a missing extension. A real MetaMask connection still needs the browser extension and user approval.

## Files

- `index.html` — content and page structure
- `styles.css` — visual design and responsive layout
- `script.js` — optional wallet interaction
- `favicon.svg` — site icon

This is an educational introduction, not financial advice. Always review wallet requests before approving them.
