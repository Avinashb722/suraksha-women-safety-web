import React from "react";
import Sidebar from "../Components/Dash/Sidebar";
import { useState, useEffect } from "react";
import axios from 'axios'
import toast from "react-hot-toast";

const Dashboard = (props) => {
  const [incidentreport, setincidentreport] = useState([]);
  const [report,setReport] = useState("")

  const getAllIncident = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/v1/incidents',{
        method: "GET",
        headers: {"Content-type": "application/json"}
      })

      if(res.status === 200){
        const data  = await res.json();
       console.log(data)
        setincidentreport(data)
      
      
      }

      

      
    } catch (err) {
      console.log(err)
    }
  }

  const [ack,setAck] = useState(false)


  const acknowledge = async (incId) => {
    try{
      const res = await fetch(`http://localhost:5001/api/v1/incidents/${incId}`,{
        method:"PATCH",
        headers: {'Content-type': 'application/json'}
      });

      if(res.status === 200){
        toast.success("Updated Successfully")
      }

    }catch(e){
      toast.error("Error while Updating !")
    }finally{
      setAck(!ack);
    }
  }

  useEffect(() => {
    getAllIncident();
    window.scrollTo(0, 0)
  }, [ack])

  return (
    <div className="d-flex justify-content-start">
      <Sidebar />
      <div className="container table-responsive mx-3">
        <div className='features_wrapper' style={{ marginTop: '-50px' }}>
          <div className="row">
            <div className="col-12 text-center">
              <p className="features_subtitle">Latest Women Incident Reported !</p>
              <h2 className="features_title">Women Incident Data</h2>
            </div>
          </div>
        </div>
        <table class="table table-striped table-bordered table-hover" style={{ marginTop: '-50px' }}>
          <thead className="table-dark text-center">
            <tr >
              <th scope="col">Name</th>
              <th scope="col">Report</th>
              <th scope="col">Address</th>
              <th scope="col">Pincode</th>
              <th scope="col">Evidence</th>
              <th scope="col">Incident recorded Date & Time</th>
              <th scope="col">Acknowledgement Status</th>
              
            </tr>
          </thead>
          <tbody className="text-center ">
            {incidentreport.map((p,_) => (
                <>
                    {p.isSeen?(<>
                    
                      <tr  key={_}>
                      <th  style={{color: "green"}} scope="row">{p.uname}</th>
                      <td>{p.report}</td>
                      <td>{p.address}</td>
                      <td>{p.pincode}</td>
                      <td>
                        {p.files && p.files.length > 0 ? (
                          <button className="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target={`#filesModal${_}`}>
                            📎 {p.files.length} file(s)
                          </button>
                        ) : (
                          <span className="text-muted">No files</span>
                        )}
                      </td>
                      <td>{p.createdAt.split('T')[0]} - {p.createdAt.split('T')[1].split('.')[0]}</td>
                      <td><button className="btn btn-success" >Acknowledged</button></td>
                    </tr>
                    </>):(<>
                      <tr  key={_}>
                      <th  style={{color: "red"}} scope="row">{p.uname}</th>
                      <td><button type="button" class="btn btn-dark" onClick={() => setReport(p.report)} data-bs-toggle="modal" data-bs-target="#exampleModal">
                       View Report
                      </button></td>
                      <td>{p.address}</td>
                      <td>{p.pincode}</td>
                      <td>
                        {p.files && p.files.length > 0 ? (
                          <button className="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target={`#filesModal${_}`}>
                            📎 {p.files.length} file(s)
                          </button>
                        ) : (
                          <span className="text-muted">No files</span>
                        )}
                      </td>
                      <td>{p.createdAt.split('T')[0]} - {p.createdAt.split('T')[1].split('.')[0]}</td>
                      <td><button className="btn btn-danger" onClick={() => acknowledge(p._id)} >Acknowledge</button></td>
                    </tr>
                    </>)}
                </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Modal */}
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Incident Report</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              {report}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Files Modals */}
      {incidentreport.map((p, index) => (
        p.files && p.files.length > 0 && (
          <div key={index} class="modal fade" id={`filesModal${index}`} tabindex="-1">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Evidence Files - {p.uname}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <div className="row">
                    {p.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="col-md-6 mb-3">
                        <div className="card">
                          <div className="card-body text-center">
                            {file.toLowerCase().includes('.mp4') || file.toLowerCase().includes('.avi') || file.toLowerCase().includes('.mov') ? (
                              <video controls style={{width: '100%', maxHeight: '200px'}}>
                                <source src={`http://localhost:5001${file}`} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img 
                                src={`http://localhost:5001${file}`} 
                                alt="Evidence" 
                                style={{width: '100%', maxHeight: '200px', objectFit: 'cover'}}
                                onError={(e) => {e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5GaWxlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='}}
                              />
                            )}
                            <div className="mt-2">
                              <a href={`http://localhost:5001${file}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                                📥 Download
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ))}
    </div >

  );
};

export default Dashboard;