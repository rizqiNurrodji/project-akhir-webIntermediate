// CSS imports
import '../styles/styles.css';
import { initAuth, registerServiceWorker } from './utils/index.js';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  initAuth();

  await registerServiceWorker();

  console.log('Service Worker registered successfully');

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
