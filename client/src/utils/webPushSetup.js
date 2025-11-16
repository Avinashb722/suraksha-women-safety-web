// Web Push Setup for Suraksha App

const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HcCWLEw6q-oHhiG7-sxvSKHlbABOdG-cR-6RvYjBBqhWJ9o8L9YXzqJZzs';

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Request notification permission
export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

// Subscribe to push notifications
export const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push messaging is not supported');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });

        console.log('✅ Push subscription successful');
        return subscription;
    } catch (error) {
        console.error('❌ Push subscription failed:', error);
        return null;
    }
};

// Show local notification (fallback)
export const showLocalNotification = (title, body, data = {}) => {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '/emergency-icon.png',
            badge: '/emergency-badge.png',
            data: data,
            requireInteraction: true,
            actions: [
                {
                    action: 'view-location',
                    title: 'View Location'
                }
            ]
        });

        notification.onclick = () => {
            if (data.url) {
                window.open(data.url, '_blank');
            }
            notification.close();
        };

        return notification;
    }
    return null;
};