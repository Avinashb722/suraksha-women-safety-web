import React, { useState, useEffect } from 'react';
import { requestNotificationPermission, subscribeToPush, showLocalNotification } from '../utils/webPushSetup';

const NotificationSetup = () => {
    const [permission, setPermission] = useState(Notification.permission);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        setPermission(Notification.permission);
    }, []);

    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        setPermission(Notification.permission);
        
        if (granted) {
            const subscription = await subscribeToPush();
            if (subscription) {
                setSubscribed(true);
                // Save subscription to backend here
                console.log('Subscription:', subscription);
            }
        }
    };

    const testNotification = () => {
        showLocalNotification(
            '🚨 Test Emergency Alert',
            'This is a test notification from Suraksha app',
            { url: 'https://maps.google.com/maps?q=12.9716,77.5946' }
        );
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px 0' }}>
            <h3>🔔 Emergency Notifications</h3>
            
            <div style={{ marginBottom: '15px' }}>
                <strong>Status:</strong> 
                <span style={{ 
                    color: permission === 'granted' ? 'green' : 'red',
                    marginLeft: '10px'
                }}>
                    {permission === 'granted' ? '✅ Enabled' : '❌ Disabled'}
                </span>
            </div>

            {permission !== 'granted' && (
                <div style={{ marginBottom: '15px' }}>
                    <p>Enable notifications to receive instant emergency alerts:</p>
                    <button 
                        onClick={handleEnableNotifications}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Enable Emergency Notifications
                    </button>
                </div>
            )}

            {permission === 'granted' && (
                <div>
                    <p>✅ Emergency notifications are enabled!</p>
                    <button 
                        onClick={testNotification}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Test Notification
                    </button>
                </div>
            )}

            <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                <strong>Benefits:</strong>
                <ul>
                    <li>✅ Free instant alerts</li>
                    <li>✅ Works even when app is closed</li>
                    <li>✅ Shows location and emergency actions</li>
                </ul>
            </div>
        </div>
    );
};

export default NotificationSetup;