import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import '../styles/safety-tips.css';

const SafetyTips = () => {
  const tips = [
    {
      title: "🚶‍♀️ Travel Safety",
      content: [
        "Share live location with trusted contacts",
        "Use well-lit, populated routes",
        "Keep emergency contacts on speed dial",
        "Trust your instincts",
        "Carry charged power bank",
        "Use GPS tracking ride-sharing apps",
        "Avoid displaying valuables",
        "Keep document copies separate"
      ],
      videoUrl: "https://www.youtube.com/embed/KVpxP3ZZtAc",
      videoTitle: "Travel Safety for Women",
      additionalVideos: [
        { url: "https://www.youtube.com/embed/1YbPmkChcbo", title: "Solo Travel Safety" },
        { url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Public Transport Safety" }
      ]
    },
    {
      title: "🥊 Self-Defense",
      content: [
        "Target vulnerable areas: eyes, nose, throat, groin",
        "Scream 'FIRE!' or 'HELP!' loudly",
        "Carry whistle, alarm, pepper spray",
        "Learn palm strike, knee kick, elbow strike",
        "Practice situational awareness",
        "Keep hands free while walking",
        "Learn escape from grabs",
        "Take certified self-defense class"
      ],
      videoUrl: "https://www.youtube.com/embed/T7aNSRoDCmg",
      videoTitle: "Self Defense Techniques",
      additionalVideos: [
        { url: "https://www.youtube.com/embed/KqpbkEHEsQI", title: "Krav Maga for Women" },
        { url: "https://www.youtube.com/embed/x9Tg2Zp15Rk", title: "Escape Common Attacks" }
      ]
    },
    {
      title: "💻 Digital Safety",
      content: [
        "Never share personal info with strangers",
        "Use strong privacy settings",
        "Disable auto-location sharing",
        "Report harassment/suspicious accounts",
        "Use different passwords + 2FA",
        "Beware fake profiles/catfishing",
        "Don't click suspicious links",
        "Review digital footprint regularly"
      ],
      videoUrl: "https://www.youtube.com/embed/ULGILG-ZhO0",
      videoTitle: "Digital Privacy Protection",
      additionalVideos: [
        { url: "https://www.youtube.com/embed/inWWhr5tnEA", title: "Social Media Privacy" },
        { url: "https://www.youtube.com/embed/VFns39RXPrU", title: "Online Predator Protection" }
      ]
    },
    {
      title: "🏠 Home Safety",
      content: [
        "Install quality locks, cameras, motion lights",
        "Use peepholes, verify identity",
        "Keep curtains closed at night",
        "Practice escape routes",
        "Keep emergency supplies ready",
        "Know neighbors, community watch",
        "Secure sliding doors",
        "Consider 24/7 monitoring system"
      ],
      videoUrl: "https://www.youtube.com/embed/6jMhMVEjEQg",
      videoTitle: "Home Security Tips",
      additionalVideos: [
        { url: "https://www.youtube.com/embed/8HhKSVcCQyE", title: "DIY Home Security" },
        { url: "https://www.youtube.com/embed/2FiQKKNHlcY", title: "Home Invasion Response" }
      ]
    },
    {
      title: "🌙 Night Safety",
      content: [
        "Travel in groups when possible",
        "Stay in well-lit areas",
        "Keep phone charged",
        "Inform someone of plans",
        "Use ride-sharing apps",
        "Carry flashlight",
        "Avoid headphones",
        "Have emergency cash"
      ],
      videoUrl: "https://www.youtube.com/embed/PgQy6kKjGgc",
      videoTitle: "Night Safety Tips",
      additionalVideos: [
        { url: "https://www.youtube.com/embed/7Ooa7wOKHhg", title: "Walking Alone at Night" },
        { url: "https://www.youtube.com/embed/3pasuVJVUc8", title: "Party Safety" }
      ]
    },
    {
      title: "🚗 Vehicle Safety",
      content: [
        "Lock doors, check backseat",
        "Keep fuel above quarter full",
        "Park in well-lit areas",
        "Have keys ready",
        "Drive to police if followed",
        "Keep emergency supplies",
        "Learn basic maintenance",
        "Never pick up strangers"
      ],
      videoUrl: "https://www.youtube.com/embed/7XqrCT-4Xis",
      videoTitle: "Car Safety Tips",
      additionalVideos: [
        { url: "https://www.youtube.com/embed/QIsOTmwIyJk", title: "Car Breakdown Safety" },
        { url: "https://www.youtube.com/embed/5ks-NbCKs8s", title: "Solo Road Trip Safety" }
      ]
    }
  ];

  const helplines = [
    { name: "Women Helpline", number: "1091", description: "24/7 support for women" },
    { name: "Police Emergency", number: "100", description: "Immediate police assistance" },
    { name: "National Emergency", number: "112", description: "All emergency services" },
    { name: "Domestic Violence", number: "181", description: "Domestic abuse support" },
    { name: "Child Helpline", number: "1098", description: "Child protection" },
    { name: "Cyber Crime", number: "1930", description: "Online fraud reporting" }
  ];
  

  
  const safetyResources = [
    { 
      title: "Self-Defense Classes", 
      description: "Local martial arts and training centers", 
      link: "https://www.google.com/maps/search/self+defense+classes+near+me",
      category: "Training",
      videoUrl: "https://www.youtube.com/embed/x9Tg2Zp15Rk"
    },
    { 
      title: "Legal Aid Services", 
      description: "Free legal assistance for harassment cases", 
      link: "https://www.legalaid.gov",
      category: "Legal",
      videoUrl: "https://www.youtube.com/embed/8TJxnYgP6D8"
    },
    { 
      title: "Mental Health Support", 
      description: "Trauma counseling and support services", 
      link: "https://www.samhsa.gov/find-help/national-helpline",
      category: "Health",
      videoUrl: "https://www.youtube.com/embed/nCrjevx3-Js"
    },
    { 
      title: "Women's Shelters", 
      description: "Safe accommodation in crisis situations", 
      link: "https://www.thehotline.org/get-help/domestic-violence-local-resources",
      category: "Shelter",
      videoUrl: "https://www.youtube.com/embed/V1yW5IsnSjo"
    },
    { 
      title: "Safety Equipment", 
      description: "Personal alarms, pepper spray, devices", 
      link: "https://www.amazon.com/s?k=women+safety+devices",
      category: "Equipment",
      videoUrl: "https://www.youtube.com/embed/2FiQKKNHlcY"
    },
    { 
      title: "Emergency Preparedness", 
      description: "Personal safety plans and emergency kits", 
      link: "https://www.ready.gov/make-a-plan",
      category: "Planning",
      videoUrl: "https://www.youtube.com/embed/BYvhhMjW32k"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="safety-tips-container">
        <div className="container mt-5 pt-5">
          <h1 className="text-center mb-5">Safety Tips & Resources</h1>
          
          <div className="row">
            {tips.map((tip, index) => (
              <div key={index} className="col-lg-6 mb-5">
                <div className="tip-card">
                  <h3 className="mb-3">{tip.title}</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="safety-list">
                        {tip.content.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <div className="video-container">
                        <h5 className="mb-2">📺 {tip.videoTitle}</h5>
                        <div className="video-wrapper">
                          <iframe
                            width="100%"
                            height="200"
                            src={tip.videoUrl}
                            title={tip.videoTitle}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        {tip.additionalVideos && (
                          <div className="additional-videos mt-3">
                            <h6>Related Videos:</h6>
                            {tip.additionalVideos.map((video, i) => (
                              <div key={i} className="small-video mb-2">
                                <a href={video.url.replace('/embed/', '/watch?v=')} target="_blank" rel="noopener noreferrer" className="video-link">
                                  🎥 {video.title}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="helplines-section mt-5">
            <h2 className="text-center mb-4">📞 Emergency Helplines</h2>
            <div className="row">
              {helplines.map((helpline, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div className="helpline-card">
                    <h4>{helpline.name}</h4>
                    <p className="helpline-number">{helpline.number}</p>
                    <p className="helpline-desc">{helpline.description}</p>
                    <a href={`tel:${helpline.number}`} className="btn btn-danger btn-sm">
                      📞 Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          

          
          <div className="resources-section mt-5">
            <h2 className="text-center mb-4">🛡️ Safety Resources</h2>
            <div className="row">
              {safetyResources.map((resource, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div className="resource-card">
                    <div className="resource-header">
                      <h4>{resource.title}</h4>
                      <span className="category-badge">{resource.category}</span>
                    </div>
                    <p>{resource.description}</p>
                    <div className="resource-actions">
                      <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                        Learn More →
                      </a>
                      {resource.videoUrl && (
                        <a href={resource.videoUrl.replace('/embed/', '/watch?v=')} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm ml-2">
                          📺 Watch Video
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SafetyTips;