import React, { useState } from 'react';
import { FaCopy, FaPhone, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import '../styles/helpline-numbers.css';

const HelplineNumbers = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const helplineNumbers = [
        { state: 'National', number: '1091', description: 'Women Helpline' },
        { state: 'National', number: '181', description: 'Women Helpline' },
        { state: 'National', number: '100', description: 'Police' },
        { state: 'National', number: '108', description: 'Emergency Services' },
        { state: 'Andhra Pradesh', number: '0866-2410978', description: 'Women Helpline' },
        { state: 'Arunachal Pradesh', number: '9436055743', description: 'Women Helpline' },
        { state: 'Assam', number: '181', description: 'Women Helpline' },
        { state: 'Bihar', number: '18003456247', description: 'Women Helpline' },
        { state: 'Chhattisgarh', number: '181', description: 'Women Helpline' },
        { state: 'Delhi', number: '181', description: 'Women Helpline' },
        { state: 'Delhi', number: '011-23317004', description: 'Women Helpline' },
        { state: 'Goa', number: '1091', description: 'Women Helpline' },
        { state: 'Gujarat', number: '181', description: 'Women Helpline' },
        { state: 'Haryana', number: '0124-2335100', description: 'Women Helpline' },
        { state: 'Himachal Pradesh', number: '181', description: 'Women Helpline' },
        { state: 'Jharkhand', number: '181', description: 'Women Helpline' },
        { state: 'Karnataka', number: '080-22943225', description: 'Women Helpline' },
        { state: 'Kerala', number: '0471-2338100', description: 'Women Helpline' },
        { state: 'Madhya Pradesh', number: '181', description: 'Women Helpline' },
        { state: 'Maharashtra', number: '022-24192288', description: 'Women Helpline' },
        { state: 'Manipur', number: '9436001122', description: 'Women Helpline' },
        { state: 'Meghalaya', number: '181', description: 'Women Helpline' },
        { state: 'Mizoram', number: '9436001515', description: 'Women Helpline' },
        { state: 'Nagaland', number: '9436440019', description: 'Women Helpline' },
        { state: 'Odisha', number: '06742-320200', description: 'Women Helpline' },
        { state: 'Punjab', number: '0172-2712800', description: 'Women Helpline' },
        { state: 'Rajasthan', number: '0141-2744000', description: 'Women Helpline' },
        { state: 'Sikkim', number: '181', description: 'Women Helpline' },
        { state: 'Tamil Nadu', number: '044-28592750', description: 'Women Helpline' },
        { state: 'Telangana', number: '040-23320539', description: 'Women Helpline' },
        { state: 'Tripura', number: '0381-2323355', description: 'Women Helpline' },
        { state: 'Uttar Pradesh', number: '1090', description: 'Women Helpline' },
        { state: 'Uttarakhand', number: '0135-2710126', description: 'Women Helpline' },
        { state: 'West Bengal', number: '033-24799633', description: 'Women Helpline' }
    ];

    const filteredNumbers = helplineNumbers.filter(item =>
        item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.number.includes(searchTerm)
    );

    const copyToClipboard = (number) => {
        navigator.clipboard.writeText(number);
        toast.success(`Copied ${number} to clipboard`);
    };

    const makeCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    return (
        <>
            <Navbar />
            <div className="helpline-container">
                <div className="helpline-header">
                    <h1>Women Helpline Numbers</h1>
                    <p>Emergency contact numbers for women's safety across India</p>
                </div>

                <div className="search-container">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by state or number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="helpline-grid">
                    {filteredNumbers.map((item, index) => (
                        <div key={index} className="helpline-card">
                            <div className="card-header">
                                <h3>{item.state}</h3>
                                <span className="description">{item.description}</span>
                            </div>
                            <div className="number-display">
                                <span className="number">{item.number}</span>
                            </div>
                            <div className="action-buttons">
                                <button
                                    className="copy-btn"
                                    onClick={() => copyToClipboard(item.number)}
                                    title="Copy to clipboard"
                                >
                                    <FaCopy /> Copy
                                </button>
                                <button
                                    className="call-btn"
                                    onClick={() => makeCall(item.number)}
                                    title="Make a call"
                                >
                                    <FaPhone /> Call
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredNumbers.length === 0 && (
                    <div className="no-results">
                        <p>No helpline numbers found for your search.</p>
                    </div>
                )}

                <div className="emergency-note">
                    <h3>⚠️ Emergency Guidelines</h3>
                    <ul>
                        <li>In immediate danger, call <strong>100</strong> (Police) or <strong>112</strong> (Emergency)</li>
                        <li>For women-specific issues, use <strong>181</strong> or <strong>1091</strong></li>
                        <li>Keep these numbers saved in your phone for quick access</li>
                        <li>Share your location when calling for help</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HelplineNumbers;