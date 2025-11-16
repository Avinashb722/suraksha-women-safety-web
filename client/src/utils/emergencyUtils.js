import toast from "react-hot-toast";

// Get server URL based on environment
const getServerUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5001';
  }
  return `http://${hostname}:5001`;
};

// Prevent multiple simultaneous calls
let isEmergencyInProgress = false;

export const triggerEmergency = async (auth) => {
  // Prevent multiple simultaneous emergency calls
  if (isEmergencyInProgress) {
    console.log('Emergency already in progress, skipping...');
    return false;
  }
  
  isEmergencyInProgress = true;
  
  try {
    console.log('Triggering emergency...');
    
    // Check localStorage if auth is not available
    let userId = auth?.user?._id;
    if (!userId) {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        try {
          const parsedAuth = JSON.parse(storedAuth);
          userId = parsedAuth?.user?._id;
        } catch (e) {
          console.log('Parse error:', e);
        }
      }
    }
    
    if (!userId) {
      toast.error("Please login first");
      return false;
    }

    console.log('User ID found:', userId);
    toast.loading("Getting your location...");

    // Get current location with timeout
    const position = await getCurrentPosition();
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    
    console.log('Location obtained:', lat, long);
    toast.dismiss();
    toast.loading("Sending emergency alert...");

    const payload = {
      userId: userId,
      lat: lat,
      long: long,
    };

    console.log('Sending payload:', payload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(
      `${getServerUrl()}/api/v1/emergency/emergencyPressed`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { 
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);
    toast.dismiss();
    
    const responseData = await res.json();
    console.log('Server response:', responseData);

    if (res.status === 200) {
      console.log('Emergency sent successfully, stopping all processes');
      return true;
    } else {
      toast.error(responseData.message || "SOS FAILED");
      return false;
    }
  } catch (error) {
    toast.dismiss();
    console.error("Emergency trigger error:", error);
    
    if (error.name === 'AbortError') {
      toast.error("Emergency request timed out. Please try again.");
    } else if (error.name === 'GeolocationPositionError' || error.message.includes('location')) {
      toast.error("Location access denied. Please enable location services.");
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("Emergency service failed. Please try again.");
    }
    return false;
  } finally {
    // Always reset the flag to allow future emergency calls
    isEmergencyInProgress = false;
  }
};

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported by this browser"));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000 // Allow cached location up to 1 minute old
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('GPS position obtained:', position.coords);
        resolve(position);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Location access failed";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};