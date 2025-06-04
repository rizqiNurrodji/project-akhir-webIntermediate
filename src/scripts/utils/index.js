import { isLoggedIn, getUser, logout } from '../data/auth.js';

export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
export function updateNavbar(isLoggedIn, userData = null) {
  const navList = document.querySelector('.nav-list');
  const dropdown = document.querySelector('.dropdown');

  // Bersihkan elemen yang sebelumnya ditambahkan
  const removeIfExists = (selector) => {
    const existing = navList.querySelector(selector);
    if (existing) navList.removeChild(existing);
  };

  removeIfExists('li.add-story-link');
  removeIfExists('li.saved-stories-link');
  removeIfExists('li.skip-to-content');
  removeIfExists('li.notification-btn');

  if (isLoggedIn) {
    // Update link Beranda
    navList.querySelector('li:first-child a').href = '#/home';

    // Tambah Cerita
    const addStoryItem = document.createElement('li');
    addStoryItem.classList.add('add-story-link');
    addStoryItem.innerHTML = `<a href="#/add">Tambah Cerita</a>`;
    navList.insertBefore(addStoryItem, navList.children[1]);

    // Cerita Tersimpan
    const savedStoriesItem = document.createElement('li');
    savedStoriesItem.classList.add('saved-stories-link');
    savedStoriesItem.innerHTML = `<a href="#/saved">Cerita Tersimpan</a>`;
    navList.insertBefore(savedStoriesItem, navList.children[2]);

    // Skip Link
    const skipLink = document.createElement('li');
    skipLink.classList.add('skip-to-content');
    skipLink.innerHTML = `
      <a href="#/home#stories-section" class="skip-link hidden" tabindex="0">Lewati ke Daftar Cerita</a>
    `;
    navList.insertBefore(skipLink, navList.children[0]);

    // Notification
    const notification = document.createElement('li');
    notification.classList.add('notification-btn');
    notification.innerHTML = `
      <button type="button" class="btn btn-primary">
        <span class="material-symbols-outlined" aria-hidden="true">notifications</span>
        Enable Notifications
      </button>
    `;
    navList.insertBefore(notification, navList.children[4]);

    // Dropdown & Username
    dropdown.innerHTML = `<li><a href="#" id="logout-button">Logout</a></li>`;
    if (userData) {
      document.querySelector('.user-name span').textContent = userData.name;
    }
  } else {
    // Reset ke default (belum login)
    navList.querySelector('li:first-child a').href = '#/';
    dropdown.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
    document.querySelector('.user-name span').textContent = 'Guest';
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Notifikasi
  const notificationBtn = document.querySelector('.notification-btn button');
  if (notificationBtn) {
    import('../utils/push-notifications.js')
      .then(module => module.isCurrentPushSubscriptionAvailable())
      .then(isSubscribed => {
        if (isSubscribed) {
          notificationBtn.innerHTML = `
            <span class="material-symbols-outlined" aria-hidden="true">notifications_off</span>
            Disable Notifications
          `;
          notificationBtn.classList.remove('btn-primary');
          notificationBtn.classList.add('btn-danger');
        }
      });

    notificationBtn.addEventListener('click', async () => {
      const { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } = await import('../utils/push-notifications.js');
      const isSubscribed = await isCurrentPushSubscriptionAvailable();

      if (isSubscribed) {
        const confirmUnsub = confirm('Kamu sudah berlangganan notifikasi. Ingin berhenti langganan?');
        if (confirmUnsub) {
          await unsubscribe();
          notificationBtn.innerHTML = `
            <span class="material-symbols-outlined" aria-hidden="true">notifications</span>
            Enable Notifications
          `;
          notificationBtn.classList.remove('btn-danger');
          notificationBtn.classList.add('btn-primary');
        }
      } else {
        await subscribe();
        notificationBtn.innerHTML = `
          <span class="material-symbols-outlined" aria-hidden="true">notifications_off</span>
          Disable Notifications
        `;
        notificationBtn.classList.remove('btn-primary');
        notificationBtn.classList.add('btn-danger');
      }
    });
  }
}


// Setup awal navbar
export function initAuth() {
  updateNavbar(isLoggedIn(), getUser());
  setupSkipLinkFocus();
}

function setupSkipLinkFocus() {
  let alreadyShown = false;
  const skipLink = document.querySelector('.skip-link');

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !alreadyShown) {
      if (skipLink) {
        skipLink.classList.remove('hidden');
        alreadyShown = true;
      }
    }
  });

  if (skipLink) {
    skipLink.addEventListener('click', () => {
      skipLink.classList.add('hidden');
      alreadyShown = false; // reset supaya bisa muncul lagi saat tab berikutnya
    });
  }
}


export function showLoading() {
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
  }
}

export function hideLoading() {
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }
}

export function isServiceWorkerAvailable() {
  return 'serviceWorker' in navigator;
}

export async function registerServiceWorker() {
  if (!isServiceWorkerAvailable()) {
    console.log('Service Worker API unsupprorted in this browser.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.bundle.js');
    console.log('Service Worker registered successfully:', registration);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

export function convertBase64ToBlob(base64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export function convertBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
export function initNotification() {

}