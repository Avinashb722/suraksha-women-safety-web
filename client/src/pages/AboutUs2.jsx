import React, { useEffect, useState } from "react";
import "../styles/about.css";
import about from "../images/aboutUs.png";
import about2 from "../images/aboutUs2.png";
import "../styles/features.css";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { Link } from "react-router-dom";

const AboutUs2 = () => {
  const [isVisible, setIsVisible] = useState({});
  const [activeTab, setActiveTab] = useState('mission');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: '🚨', title: 'Emergency Alert', desc: 'Instant SOS with location sharing' },
    { icon: '📱', title: 'Smart Detection', desc: 'AI-powered threat detection' },
    { icon: '👥', title: 'Community Support', desc: 'Connect with nearby helpers' },
    { icon: '🛡️', title: 'Privacy First', desc: 'Your data is always secure' }
  ];

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-gradient"></div>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content animate-on-scroll" id="hero-text">
                <span className="hero-badge">🛡️ Empowering Women Since 2024</span>
                <h1 className="hero-title">
                  Creating a <span className="gradient-text">Safer World</span> for Every Woman
                </h1>
                <p className="hero-description">
                  Suraksha combines cutting-edge technology with community support to provide 
                  comprehensive safety solutions that empower women to live fearlessly.
                </p>
                <div className="hero-buttons">
                  <Link to="/emergency" className="btn-primary-modern">
                    Get Protected Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image animate-on-scroll" id="hero-img">
                <img src={about} alt="Safety" className="main-hero-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="story-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="story-image animate-on-scroll" id="story-img">
                <img src={about2} alt="Our Story" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="story-content animate-on-scroll" id="story-text">
                <span className="section-badge">Our Journey</span>
                <h2 className="section-title">Built by Women, for Women</h2>
                <p className="section-description">
                  Founded by a team of passionate women technologists, Suraksha was born 
                  from personal experiences and a shared vision of creating a world where 
                  every woman feels safe and empowered.
                </p>
                
                {/* Tab Navigation */}
                <div className="tab-navigation">
                  <button 
                    className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mission')}
                  >
                    Mission
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`}
                    onClick={() => setActiveTab('vision')}
                  >
                    Vision
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'values' ? 'active' : ''}`}
                    onClick={() => setActiveTab('values')}
                  >
                    Values
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {activeTab === 'mission' && (
                    <div className="tab-panel">
                      <h4>Our Mission</h4>
                      <p>To leverage technology and community power to create comprehensive safety solutions that enable women to live without fear.</p>
                    </div>
                  )}
                  {activeTab === 'vision' && (
                    <div className="tab-panel">
                      <h4>Our Vision</h4>
                      <p>A world where every woman has access to immediate help, feels secure in any environment, and is empowered to pursue her dreams fearlessly.</p>
                    </div>
                  )}
                  {activeTab === 'values' && (
                    <div className="tab-panel">
                      <h4>Our Values</h4>
                      <p>Privacy, empowerment, community, innovation, and unwavering commitment to women's safety and dignity.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Why Choose Suraksha</span>
            <h2 className="section-title">Advanced Safety Features</h2>
            <p className="section-description mx-auto">
              Cutting-edge technology meets intuitive design to provide comprehensive protection
            </p>
          </div>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="feature-card animate-on-scroll" id={`feature-${index}`}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h3 className="cta-title">Ready to Feel Safer?</h3>
                <p className="cta-description">
                  Join thousands of women who trust Suraksha for their safety. 
                  Get started today and experience peace of mind.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/register" className="btn-cta">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs2;