const connectButtons = [...document.querySelectorAll('[data-connect-wallet]')];
const headerButton = document.querySelector('.header-wallet');
const headerLabel = document.querySelector('[data-wallet-label]');
const status = document.querySelector('#wallet-status');

let announcedMetaMask = null;
let activeProvider = null;
let requestInProgress = false;

// EIP-6963 lets us choose MetaMask when several wallet extensions are installed.
window.addEventListener('eip6963:announceProvider', (event) => {
  const { info, provider } = event.detail || {};
  if (info?.rdns === 'io.metamask' && typeof provider?.request === 'function') {
    announcedMetaMask = provider;
  }
});
window.dispatchEvent(new Event('eip6963:requestProvider'));

function findMetaMask() {
  if (announcedMetaMask) return announcedMetaMask;

  const injected = window.ethereum;
  const providers = Array.isArray(injected?.providers) ? injected.providers : [injected];
  return providers.find((provider) => provider?.isMetaMask && typeof provider.request === 'function') || null;
}

function shortAddress(address) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function showAccount(address) {
  const abbreviated = shortAddress(address);
  headerLabel.textContent = abbreviated;
  headerButton.setAttribute('aria-label', `MetaMask connected: ${abbreviated}`);
  status.textContent = `Connected: ${abbreviated}. No transaction was requested.`;
}

function clearAccount(message) {
  headerLabel.textContent = 'Connect MetaMask';
  headerButton.setAttribute('aria-label', 'Connect MetaMask');
  status.textContent = message;
}

function handleAccountsChanged(accounts) {
  if (accounts?.[0]) showAccount(accounts[0]);
  else clearAccount('MetaMask is no longer connected. You can keep reading.');
}

function useProvider(provider) {
  if (activeProvider === provider) return;
  activeProvider?.removeListener?.('accountsChanged', handleAccountsChanged);
  activeProvider = provider;
  activeProvider.on?.('accountsChanged', handleAccountsChanged);
}

async function connectMetaMask() {
  if (requestInProgress) return;
  requestInProgress = true;
  connectButtons.forEach((button) => { button.disabled = true; });

  try {
    // Ask installed wallets to announce themselves again before falling back to window.ethereum.
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    let provider = findMetaMask();
    if (!provider) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      provider = findMetaMask();
    }

    if (!provider) {
      clearAccount(location.protocol === 'file:'
        ? 'MetaMask is not available here. Open this page on localhost in a browser with MetaMask enabled.'
        : 'MetaMask is not available in this browser. Install or enable the extension, then try again.');
      status.scrollIntoView({ block: 'nearest' });
      return;
    }

    useProvider(provider);
    status.textContent = 'Check MetaMask for the connection request…';
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    if (accounts?.[0]) showAccount(accounts[0]);
    else clearAccount('No account was selected. You can try again whenever you like.');
  } catch (error) {
    if (error?.code === 4001) {
      clearAccount('Connection declined. You can keep reading without a wallet.');
    } else if (error?.code === -32002) {
      status.textContent = 'A MetaMask request is already open. Check the extension to finish it.';
    } else {
      status.textContent = 'Could not connect. Check that MetaMask is unlocked, then try again.';
    }
  } finally {
    requestInProgress = false;
    connectButtons.forEach((button) => { button.disabled = false; });
  }
}

connectButtons.forEach((button) => button.addEventListener('click', connectMetaMask));
