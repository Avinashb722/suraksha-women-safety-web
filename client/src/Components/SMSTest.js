import React, { useState } from 'react';

const SMSTest = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const testSMS = async () => {
        if (!phoneNumber) {
            setResult('Please enter a phone number');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const response = await fetch('/api/v1/sms/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    message: message || 'Test emergency message from Suraksha app'
                })
            });

            const data = await response.json();

            if (response.ok) {
                setResult('✅ SMS sent successfully!');
            } else {
                setResult(`❌ Failed: ${data.message}`);
            }
        } catch (error) {
            setResult(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h3>🚨 Test Emergency SMS</h3>
            
            <div style={{ marginBottom: '15px' }}>
                <label>Phone Number:</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    style={{ 
                        width: '100%', 
                        padding: '8px', 
                        marginTop: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Custom Message (optional):</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Custom test message..."
                    style={{ 
                        width: '100%', 
                        padding: '8px', 
                        marginTop: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        height: '60px'
                    }}
                />
            </div>

            <button
                onClick={testSMS}
                disabled={loading}
                style={{
                    backgroundColor: loading ? '#ccc' : '#dc3545',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%'
                }}
            >
                {loading ? 'Sending...' : 'Send Test SMS'}
            </button>

            {result && (
                <div style={{ 
                    marginTop: '15px', 
                    padding: '10px', 
                    backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
                    border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                    borderRadius: '4px',
                    color: result.includes('✅') ? '#155724' : '#721c24'
                }}>
                    {result}
                </div>
            )}

            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                <strong>Note:</strong> This uses free SMS services with daily limits. 
                For production, configure paid SMS services in the .env file.
            </div>
        </div>
    );
};

export default SMSTest;