// Service Worker for Web Push Notifications

self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: data.icon || '/emergency-icon.png',
            badge: data.badge || '/emergency-badge.png',
            data: data.data,
            requireInteraction: true,
            actions: data.actions || [
                {
                    action: 'view-location',
                    title: 'View Location'
                },
                {
                    action: 'call-help', 
                    title: 'Call 112'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'view-location') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    } else if (event.action === 'call-help') {
        event.waitUntil(
            clients.openWindow('tel:112')
        );
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});