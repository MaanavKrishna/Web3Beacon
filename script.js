const walletButtons = document.querySelectorAll('[data-connect-wallet]');
const walletLabel = document.querySelector('[data-wallet-label]');
const walletStatus = document.querySelector('#wallet-status');

function showAccount(address) {
  walletLabel.textContent = `${address.slice(0, 6)}…${address.slice(-4)}`;
  document.querySelector('.wallet-button').setAttribute('aria-label', `Wallet connected: ${address.slice(0, 6)}…${address.slice(-4)}`);
  walletStatus.textContent = `Wallet connected: ${address.slice(0, 6)}…${address.slice(-4)}. Review requests before signing anything.`;
}

walletButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    if (!window.ethereum?.request) {
      walletStatus.textContent = 'No browser wallet found. Install a compatible wallet extension to try connecting.';
      walletStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    try {
      walletStatus.textContent = 'Waiting for your wallet…';
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts?.[0]) showAccount(accounts[0]);
      else walletStatus.textContent = 'No account was selected. You can try again anytime.';
    } catch (error) {
      walletStatus.textContent = error?.code === 4001
        ? 'Connection canceled. You can explore without a wallet.'
        : 'Could not connect this wallet. Check the wallet extension and try again.';
    }
  });
});

if (window.ethereum?.on) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts?.[0]) showAccount(accounts[0]);
    else {
      walletLabel.textContent = 'Connect wallet';
      document.querySelector('.wallet-button').setAttribute('aria-label', 'Connect wallet');
      walletStatus.textContent = 'Wallet disconnected. You can continue exploring without it.';
    }
  });
}
