const webpush = require('web-push');

// VAPID keys for web push (generate once)
const vapidKeys = {
    publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HcCWLEw6q-oHhiG7-sxvSKHlbABOdG-cR-6RvYjBBqhWJ9o8L9YXzqJZzs',
    privateKey: 'dGEsxzaFZsxsaQhejRe7g9FivDui3KkbdgNiRxBdCml'
};

webpush.setVapidDetails(
    'mailto:suraksha7363@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const sendWebPushNotification = async (subscription, payload) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
        console.log('✅ Web push notification sent');
        return true;
    } catch (error) {
        console.error('❌ Web push failed:', error.message);
        return false;
    }
};

const sendEmergencyWebPush = async (user, lat, long) => {
    const payload = {
        title: '🚨 EMERGENCY ALERT',
        body: `${user.uname} needs help! Location: ${lat}, ${long}`,
        icon: '/emergency-icon.png',
        badge: '/emergency-badge.png',
        data: {
            url: `https://maps.google.com/maps?q=${lat},${long}`,
            userId: user._id,
            timestamp: new Date().toISOString()
        },
        actions: [
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

    console.log('📱 Sending web push notifications...');
    
    // In real implementation, get subscriptions from database
    // For now, simulate notification sending
    console.log('🔔 Web Push Alert:');
    console.log(`   Title: ${payload.title}`);
    console.log(`   Message: ${payload.body}`);
    console.log(`   Map Link: ${payload.data.url}`);
    console.log('   Actions: View Location, Call 112');
    
    return true;
};

module.exports = { 
    sendEmergencyWebPush, 
    sendWebPushNotification,
    vapidKeys 
};