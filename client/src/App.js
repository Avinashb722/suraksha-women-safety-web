import {BrowserRouter as Router, Route,Routes} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import './App.css';
import NotFound from './Components/Errors/404';
import Home from './pages/Home'
import Profile from './pages/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Emergency from './pages/Emergency';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import Incident from './pages/IncidentReport'
import CloseFile from './pages/CloseFile'
import AboutUs2 from './pages/AboutUs2';
import ContactUs from './Components/ContactUs';
import ChatScreen from './pages/ChatScreen'
import LocationTest from './pages/LocationTest';
import SafetyTips from './pages/SafetyTips';
import SafetyQuiz from './pages/SafetyQuiz';
import WeatherSafety from './pages/WeatherSafety';
import Feedback from './pages/Feedback';
import PoliceMap from './pages/PoliceMap';
import HelplineNumbers from './pages/HelplineNumbers';
import SafetyChatbot from './pages/SafetyChatbot';
import TrackMe from './pages/TrackMe';
import LocationReminder from './pages/LocationReminder';
import AdminChat from './pages/AdminChat';
import ShakeAlert from './pages/ShakeAlert';
import FakeCall from './pages/FakeCall';
import SafeRoute from './pages/SafeRoute';


import NightMode from './pages/NightMode';
import AIAssistant from './Components/AIAssistant';
import PanicButton from './Components/PanicButton';

function App() {
  return (
    <Router>
      <Routes> 
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<AboutUs2 />} />
      <Route path='/*' element={<NotFound/>} />
      <Route path='/dashboard/profile' element={<Profile/>} />
      <Route path='/contact' element={<ContactUs/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/report' element={<Report/>} />
      <Route path='/emergency' element={<Emergency/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/incident' element={<Incident/>} />
      <Route path='/closedreport' element={<CloseFile/>} />

      <Route path='/chat' element={<ChatScreen/>} />
      <Route path='/location-test' element={<LocationTest/>} />
      <Route path='/safety-tips' element={<SafetyTips/>} />
      <Route path='/safety-quiz' element={<SafetyQuiz/>} />
      <Route path='/weather-safety' element={<WeatherSafety/>} />
      <Route path='/feedback' element={<Feedback/>} />
      <Route path='/police-map' element={<PoliceMap/>} />
      <Route path='/helpline-numbers' element={<HelplineNumbers/>} />
      <Route path='/safety-chatbot' element={<SafetyChatbot/>} />
      <Route path='/track-me' element={<TrackMe/>} />
      <Route path='/location-reminder' element={<LocationReminder/>} />
      <Route path='/admin-chat' element={<AdminChat/>} />
      <Route path='/shake-alert' element={<ShakeAlert/>} />
      <Route path='/fake-call' element={<FakeCall/>} />
      <Route path='/safe-route' element={<SafeRoute/>} />


      <Route path='/night-mode' element={<NightMode/>} />

      </Routes>
      <PanicButton />
      <AIAssistant />
      <Toaster />
    </Router>
  
  )
  ;
  
}

export default App;
