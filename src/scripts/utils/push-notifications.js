import CONFIG from '../config.js';
import { convertBase64ToUint8Array } from './index.js';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api.js';

export function isNotificationGranted() {
    return Notification.permission === 'granted';
}

export function isNotificationAvailable() {
    return 'Notification' in window;
}

export async function requestNotificationPermission() {
    if (!isNotificationAvailable()) {
        console.error('Notification API is not available in this browser.');
        return false;
    }
    if (isNotificationGranted()) {
        return true;
    }

    const status = await Notification.requestPermission();
    if (status === 'denied') {
        console.log('Notification permission denied by the user.');
        alert('Notification permission is denied.');
        return false;
    }

    if (status === 'default') {
        console.log('Notification permission request dismissed by the user.');
        alert('Notification permission request was dismissed.');
        return false;
    }

    return true;
}

export async function getPushSubscription() {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
    return !!(await getPushSubscription());
}


export function generateSubscribeOptions() {
    return {
        userVisibleOnly: true,
        applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_KEY)
    };
}

export async function subscribe() {
    if (!(await requestNotificationPermission())) {
        return;
    }
    if (await isCurrentPushSubscriptionAvailable()) {
        alert('Sudah berlangganan push notification.');
        return;
    }

    console.log('Mulai berlangganan push notification...');

    const failureSubscribeMessage = 'Gagal mengaktifkan langganan push notification. ';
    const successSubscribeMessage = 'Berhasil mengaktifkan langganan push notification.';

    let pushSubscription;

    try {
        const registration = await navigator.serviceWorker.ready;
        pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

        const { endpoint, keys } = pushSubscription.toJSON();
        const response = await subscribePushNotification({ endpoint, keys });

        if (!response.ok) {
            console.error('subscribe: response:', response);
            alert(failureSubscribeMessage);

            // Undo subscribe to push notification
            await pushSubscription.unsubscribe();

            return;
        }

        alert(successSubscribeMessage);
    } catch (error) {
        console.error('subscribe: error:', error);
        alert(failureSubscribeMessage);

        // Undo subscribe to push notification
        await pushSubscription.unsubscribe();
    }
}

export async function unsubscribe() {
    const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
    const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';

    try {
        const pushSubscription = await getPushSubscription();

        if (!pushSubscription) {
            alert('Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.');
            return;
        }

        const { endpoint, keys } = pushSubscription.toJSON();
        const response = await unsubscribePushNotification({ endpoint });

        if (!response.ok) {
            alert(failureUnsubscribeMessage);
            console.error('unsubscribe: response:', response);

            return;
        }

        const unsubscribed = await pushSubscription.unsubscribe();

        if (!unsubscribed) {
            alert(failureUnsubscribeMessage);
            await subscribePushNotification({ endpoint, keys });

            return;
        }

        alert(successUnsubscribeMessage);
    } catch (error) {
        alert(failureUnsubscribeMessage);
        console.error('unsubscribe: error:', error);
    }
}
