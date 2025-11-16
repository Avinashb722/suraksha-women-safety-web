import React, { useState } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import '../styles/safety-quiz.css';

const SafetyQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      question: "What will you do if someone follows you at night?",
      options: ["Run to the nearest crowded place", "Ignore and keep walking", "Confront the person", "Call someone loudly on phone"],
      correct: 0,
      tip: "Always move to a crowded, well-lit area. Make noise to attract attention and call for help."
    },
    {
      question: "What should you carry for personal safety?",
      options: ["Pepper spray", "Whistle", "Emergency contacts list", "All of the above"],
      correct: 3,
      tip: "Carry multiple safety tools. A whistle, pepper spray, and emergency contacts can all be lifesavers."
    },
    {
      question: "If you feel unsafe in a taxi/cab, what should you do?",
      options: ["Stay quiet and wait", "Share live location with someone", "Jump out at traffic signal", "Argue with driver"],
      correct: 1,
      tip: "Always share your live location with trusted contacts when traveling alone."
    },
    {
      question: "What's the first thing to do in an emergency?",
      options: ["Call 100 (Police)", "Call family", "Post on social media", "Try to handle alone"],
      correct: 0,
      tip: "In emergencies, call 100 (Police) or 112 (National Emergency) immediately for fastest response."
    },
    {
      question: "When walking alone at night, you should:",
      options: ["Walk in dark alleys", "Stay on well-lit main roads", "Wear headphones", "Look at your phone"],
      correct: 1,
      tip: "Well-lit areas with good visibility are safer. Avoid distractions like phones or headphones."
    },
    {
      question: "If someone grabs you, what should you do first?",
      options: ["Scream loudly", "Try to negotiate", "Stay calm and quiet", "Close your eyes"],
      correct: 0,
      tip: "Make as much noise as possible to attract attention and scare off the attacker."
    },
    {
      question: "What information should you share when calling for help?",
      options: ["Only your name", "Location and situation", "Just say help", "Your age"],
      correct: 1,
      tip: "Always provide your exact location and describe the emergency clearly for faster response."
    },
    {
      question: "Which body parts are most vulnerable in self-defense?",
      options: ["Arms and legs", "Eyes, nose, groin, knees", "Hands and feet", "Back and shoulders"],
      correct: 1,
      tip: "Target vulnerable areas like eyes, nose, groin, and knees for maximum impact in self-defense."
    },
    {
      question: "When using public transport, you should:",
      options: ["Sit near the driver/conductor", "Sit in empty areas", "Sleep during journey", "Share personal details"],
      correct: 0,
      tip: "Stay near the driver or conductor where there are more people and help is available."
    },
    {
      question: "If you're being stalked, what should you do?",
      options: ["Ignore it completely", "Document and report to police", "Confront the stalker", "Change your routine secretly"],
      correct: 1,
      tip: "Document all incidents with dates, times, and evidence. Report to police immediately."
    },
    {
      question: "What should you do before going on a date with someone new?",
      options: ["Keep it secret", "Tell a friend your plans", "Meet at their place", "Go to isolated places"],
      correct: 1,
      tip: "Always inform a trusted friend about your plans, location, and expected return time."
    },
    {
      question: "Which drink safety rule is most important?",
      options: ["Accept drinks from strangers", "Never leave your drink unattended", "Drink as much as possible", "Share drinks with others"],
      correct: 1,
      tip: "Never leave your drink unattended and don't accept drinks from strangers to avoid spiking."
    },
    {
      question: "If you feel dizzy or unwell suddenly at a party, you should:",
      options: ["Go home alone", "Ask a trusted friend for help", "Ignore the feeling", "Accept help from strangers"],
      correct: 1,
      tip: "If you feel unusually unwell, get help from trusted friends immediately. You might have been drugged."
    },
    {
      question: "What's the safest way to use ATMs?",
      options: ["Use isolated ATMs at night", "Use ATMs in well-lit, busy areas", "Share your PIN with friends", "Count money at the ATM"],
      correct: 1,
      tip: "Use ATMs in well-lit, busy areas during daytime. Be aware of your surroundings."
    },
    {
      question: "When parking your car, you should:",
      options: ["Park in dark corners", "Park near lights and exits", "Leave doors unlocked", "Keep windows open"],
      correct: 1,
      tip: "Park in well-lit areas near exits. Always lock your car and check surroundings before getting out."
    },
    {
      question: "If someone is following your car, what should you do?",
      options: ["Go home directly", "Drive to a police station", "Speed up dangerously", "Stop and confront"],
      correct: 1,
      tip: "Drive to the nearest police station or busy public place. Never go home as it reveals your address."
    },
    {
      question: "What should you do if you receive threatening messages?",
      options: ["Delete them immediately", "Screenshot and report to police", "Reply angrily", "Ignore completely"],
      correct: 1,
      tip: "Save all evidence by taking screenshots and report to police. Don't engage with the sender."
    },
    {
      question: "Which self-defense technique is most effective?",
      options: ["Complex martial arts moves", "Simple, loud, and fast actions", "Trying to overpower attacker", "Reasoning with attacker"],
      correct: 1,
      tip: "Simple, loud actions like screaming and targeting vulnerable spots are most effective for escape."
    },
    {
      question: "When should you trust your instincts?",
      options: ["Never", "Always, if something feels wrong", "Only during daytime", "Only with strangers"],
      correct: 1,
      tip: "Always trust your gut feeling. If something feels wrong, remove yourself from the situation immediately."
    },
    {
      question: "What's the most important safety app feature?",
      options: ["Games", "Emergency SOS with location sharing", "Social media", "Shopping"],
      correct: 1,
      tip: "Emergency SOS apps that share your location with trusted contacts can be lifesaving in dangerous situations."
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
  };

  return (
    <>
      <Navbar />
      <div className="quiz-container">
        <div className="container mt-5 pt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="quiz-card">
                <div className="quiz-header">
                  <h2>Safety Awareness Quiz</h2>
                  <div className="progress-bar">
                    <div className="progress" style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}></div>
                  </div>
                  <p>Question {currentQuestion + 1} of {questions.length}</p>
                </div>

                {!showResult ? (
                  <div className="question-section">
                    <h3>{questions[currentQuestion].question}</h3>
                    <div className="options">
                      {questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
                          onClick={() => handleAnswerSelect(index)}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </button>
                      ))}
                    </div>
                    <button 
                      className="submit-btn" 
                      onClick={handleSubmit}
                      disabled={selectedAnswer === ''}
                    >
                      Submit Answer
                    </button>
                  </div>
                ) : (
                  <div className="result-section">
                    <div className={`result ${selectedAnswer === questions[currentQuestion].correct ? 'correct' : 'incorrect'}`}>
                      <h3>{selectedAnswer === questions[currentQuestion].correct ? '✅ Correct!' : '❌ Incorrect'}</h3>
                      <p><strong>Correct Answer:</strong> {String.fromCharCode(65 + questions[currentQuestion].correct)}. {questions[currentQuestion].options[questions[currentQuestion].correct]}</p>
                      <div className="tip">
                        <h4>💡 Safety Tip:</h4>
                        <p>{questions[currentQuestion].tip}</p>
                      </div>
                    </div>
                    
                    {currentQuestion < questions.length - 1 ? (
                      <button className="next-btn" onClick={handleNext}>
                        Next Question →
                      </button>
                    ) : (
                      <div className="final-score">
                        <h3>Quiz Complete! 🎉</h3>
                        <p>Your Score: {score}/{questions.length}</p>
                        <p className={score >= 15 ? 'text-success' : score >= 10 ? 'text-warning' : 'text-danger'}>
                          {score >= 15 ? 'Excellent! You\'re well-prepared for safety!' : 
                           score >= 10 ? 'Good job! Review the tips to improve.' : 
                           'Keep learning! Practice these safety tips.'}
                        </p>
                        <button className="restart-btn" onClick={resetQuiz}>
                          Restart Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SafetyQuiz;