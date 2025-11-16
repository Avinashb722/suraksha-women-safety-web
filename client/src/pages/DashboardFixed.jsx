import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Dash/Sidebar";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [auth] = useAuth();
  const [emerg, setEmer] = useState([]);
  const [chats, setChats] = useState([]);
  const [ack, setAck] = useState(false);
  const [activeEmergencyId, setActiveEmergencyId] = useState(null);
  const [txt, setTxt] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/v1/emergency`, {
          method: "GET",
          headers: { 'Content-type': 'application/json' }
        });

        if (res.status === 200) {
          const data = await res.json();
          if (data && data.length > 0) {
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setEmer(sortedData);
          } else {
            setEmer([]);
          }
        }
      } catch (e) {
        console.error('Error fetching emergency data:', e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [ack]);

  const getChats = async (emergId) => {
    try {
      console.log('Loading chats for emergency:', emergId);
      const res = await fetch(`http://localhost:5001/api/v1/chats/emergency/${emergId}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched chats:', data);
        setChats(data || []);
        setActiveEmergencyId(emergId);
      }
    } catch (e) {
      console.error('Error fetching chats:', e);
    }
  };

  // Auto-refresh chats
  useEffect(() => {
    if (activeEmergencyId) {
      const interval = setInterval(() => getChats(activeEmergencyId), 2000);
      return () => clearInterval(interval);
    }
  }, [activeEmergencyId]);

  const sendMessage = async (receiverId, emergId) => {
    if (!txt.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      const payload = {
        senderId: 'admin-' + auth?.user?._id,
        receiverId: receiverId,
        text: txt,
        emergId: emergId
      };

      const res = await fetch("http://localhost:5001/api/v1/chats", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Message sent!");
        setTxt("");
        setTimeout(() => getChats(emergId), 500);
      } else {
        toast.error('Failed to send message');
      }
    } catch (e) {
      console.error('Error sending message:', e);
      toast.error('Error sending message');
    }
  };

  const ackn = async (uid) => {
    try {
      const res = await fetch(`http://localhost:5001/api/v1/emergency/${uid}`, {
        method: "PATCH",
        headers: { 'Content-type': 'application/json' }
      });
      if (res.status === 200) {
        toast.success("Updated Successfully");
      }
    } catch (e) {
      toast.error("Error while Updating!");
    } finally {
      setAck(!ack);
    }
  };

  return (
    <div className="d-flex justify-content-start">
      <Sidebar />
      <div className="container table-responsive mx-3">
        <div className='features_wrapper' style={{ marginTop: '-50px' }}>
          <div className="row">
            <div className="col-12 text-center">
              <p className="features_subtitle">Latest Women Emergency Alert ! (Auto-refreshing)</p>
              <h2 className="features_title">Women Emergency Data</h2>
              <small className="text-muted">Updates every 5 seconds</small>
            </div>
          </div>
        </div>

        <table className="table table-striped table-bordered table-hover" style={{ marginTop: '-50px' }}>
          <thead className="table-dark text-center">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Address of Incident</th>
              <th scope="col">Map View</th>
              <th scope="col">Emergency No.</th>
              <th scope="col">Incident recorded at</th>
              <th scope="col">Acknowledgement Status</th>
              <th scope="col">Chat with victim</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {emerg && emerg.length > 0 ? emerg.map((ee, index) => (
              <React.Fragment key={index}>
                <tr>
                  <th scope="row" style={{ color: ee.isResolved ? "green" : "red" }}>{ee.username}</th>
                  <td>{ee.addressOfInc}</td>
                  <td>
                    <a href={`${ee.mapLct}`} target="_blank" rel="noopener noreferrer">
                      <button className="btn btn-primary">View in map</button>
                    </a>
                  </td>
                  <td>{ee.emergencyNo}</td>
                  <td>{ee.createdAt ? new Date(ee.createdAt).toLocaleString() : 'Unknown'}</td>
                  <td>
                    {ee.isResolved ? (
                      <button className="btn btn-success">Acknowledged</button>
                    ) : (
                      <button onClick={() => ackn(ee._id)} className="btn btn-danger">Acknowledge</button>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-dark" 
                      data-bs-toggle="modal" 
                      data-bs-target={`#chatModal${index}`}
                      onClick={() => getChats(ee._id)}
                    >
                      Chat
                    </button>
                  </td>
                </tr>

                {/* Chat Modal */}
                <div className="modal fade" id={`chatModal${index}`} tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Chat with {ee.username}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                      </div>
                      <div className="modal-body">
                        <div className="chat-messages" style={{ height: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                          {chats.length === 0 ? (
                            <p className="text-muted text-center">No messages yet</p>
                          ) : (
                            chats.map((chat, idx) => {
                              const isAdminMessage = chat.sender.toString().startsWith('admin-');
                              return (
                                <div key={idx} className={`d-flex mb-2 ${isAdminMessage ? 'justify-content-end' : 'justify-content-start'}`}>
                                  <div className={`p-2 rounded ${isAdminMessage ? 'bg-primary text-white' : 'bg-success text-white'}`} style={{ maxWidth: '70%' }}>
                                    <p className="mb-0">{chat.textChat}</p>
                                    <small className="text-light">
                                      {isAdminMessage ? 'Admin (You)' : ee.username}
                                    </small>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="d-flex">
                          <input 
                            className="form-control me-2" 
                            value={txt} 
                            onChange={(e) => setTxt(e.target.value)} 
                            placeholder={`Message ${ee.username}...`}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage(ee.userId, ee._id)}
                          />
                          <button 
                            className="btn btn-primary" 
                            onClick={() => sendMessage(ee.userId, ee._id)}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  <h5>No Emergency Alerts Found</h5>
                  <p>Emergency alerts will appear here when users trigger them.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;