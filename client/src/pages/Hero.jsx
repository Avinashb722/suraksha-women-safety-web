import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/hero.css'

const Hero = () => {
    return (
        <div className="hero-container">
            {/* Main Hero Section */}
            <section className='modern-hero'>
                <div className='hero-background'>
                    <div className='floating-shapes'>
                        <div className='shape shape-1'></div>
                        <div className='shape shape-2'></div>
                        <div className='shape shape-3'></div>
                    </div>
                </div>
                
                <div className='container hero-content'>
                    <div className='row align-items-center min-vh-100'>
                        <div className='col-lg-6 hero-text'>
                            <div className='hero-badge'>
                                <span>🛡️ Your Safety, Our Priority</span>
                            </div>
                            <h1 className='hero-title'>
                                Empowering <span className='gradient-text'>Women Safety</span> 
                                <br />in the Digital Age
                            </h1>
                            <p className='hero-description'>
                                Advanced emergency response system with real-time location tracking, 
                                instant alerts, and 24/7 support network to keep you safe.
                            </p>
                            
                            <div className='hero-actions'>
                                <Link to='/emergency' className='emergency-btn'>
                                    <span className='btn-icon'>🚨</span>
                                    Emergency SOS
                                </Link>
                                <Link to='/features' className='learn-btn'>
                                    Learn More
                                    <span className='btn-arrow'>→</span>
                                </Link>
                            </div>
                            
                            <div className='hero-stats'>
                                <div className='stat'>
                                    <span className='stat-number'>24/7</span>
                                    <span className='stat-label'>Support</span>
                                </div>
                                <div className='stat'>
                                    <span className='stat-number'>5sec</span>
                                    <span className='stat-label'>Response</span>
                                </div>
                                <div className='stat'>
                                    <span className='stat-number'>100%</span>
                                    <span className='stat-label'>Secure</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className='col-lg-6 hero-visual'>
                            <div className='hero-phone'>
                                <div className='phone-mockup'>
                                    <div className='phone-screen'>
                                        <div className='app-interface'>
                                            <div className='app-header'>
                                                <div className='status-bar'></div>
                                                <h3>Safety Dashboard</h3>
                                            </div>
                                            <div className='emergency-button-demo'>
                                                <div className='pulse-ring'></div>
                                                <div className='emergency-circle'>
                                                    <span>SOS</span>
                                                </div>
                                            </div>
                                            <div className='quick-actions'>
                                                <div className='action-item'>📞 Call Police</div>
                                                <div className='action-item'>📍 Share Location</div>
                                                <div className='action-item'>💬 Emergency Chat</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Quick Access Bar */}
            <div className='quick-access-bar'>
                <div className='container'>
                    <div className='quick-items'>
                        <Link to='/emergency' className='quick-item emergency'>
                            <span className='quick-icon'>🚨</span>
                            <span>Emergency</span>
                        </Link>
                        <Link to='/chat' className='quick-item'>
                            <span className='quick-icon'>💬</span>
                            <span>Live Chat</span>
                        </Link>
                        <Link to='/helpline-numbers' className='quick-item'>
                            <span className='quick-icon'>📞</span>
                            <span>Helplines</span>
                        </Link>
                        <Link to='/safety-tips' className='quick-item'>
                            <span className='quick-icon'>💡</span>
                            <span>Safety Tips</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero