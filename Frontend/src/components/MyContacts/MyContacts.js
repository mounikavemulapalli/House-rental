/** @format */

import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";
import SentChatRequestItem from "../SentChatRequestItem/SentChatRequestItem";
import Cookies from "js-cookie";
import { useState, useEffect } from "react"; 
import axios from "axios";
import "./MyContacts.css";

const MyContacts = () => {
  const [sentRequestsArray, setSentRequestsArray] = useState([]);
  const [showAvailable, setShowAvailable] = useState(true);
  const [error, setError] = useState(null); 
 
  useEffect(() => {
    const getSentChatRequests = async () => {
      const token = Cookies.get("jwt_token");
     
      if (!token) {
          setError("Authentication token not found. Please log in.");
          return; 
      }

      const url = "http://localhost:4000/sent-chat-requests";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try { 
        const response = await axios.get(url, { headers });
        setSentRequestsArray(response.data);
        setError(null); 
      } catch (err) { 
        console.error("Error fetching sent chat requests:", err);
        if (err.response && err.response.data && err.response.data.errorMsg === "Invalid JWT Token") {
          setError("Your session has expired or is invalid. Please log in again.");
          
        } else {
          setError("Failed to load contacts. Please try again later.");
        }
        setSentRequestsArray([]); 
      }
    };
    getSentChatRequests();
  }, []); 

  const handleAvailabilityChange = (event) => {
    setShowAvailable(event.target.checked);
   
    console.log("Show available:", event.target.checked);
  };


  return (
    <div className='my-contacts-page-container'>
      <ProfileSidebar />
      <div className='my-contacts-page-content-container'>
        <div className='my-contacts-header-buttons'>
          <button>All</button>
          <button>Rent</button>
          <button>Sale</button>
          <button>Commercial-Rent</button>
          <button>Commercial-Sale</button>
          <button>PG/Hostel</button>
          <button>Flatemates</button>
          <button>Land/Plot</button>
        </div>
        <br></br>
        <div className='my-contacts-title'>
          <h3>Contacted Properties</h3>
         
          <div className='form-check form-switch'> 
            <input
              className='form-check-input' 
              type='checkbox'
              id='flexSwitchCheckDefault'
              checked={showAvailable} 
              onChange={handleAvailabilityChange} 
            />
            <label className='form-check-label' htmlFor='flexSwitchCheckDefault'> {/* Use className and htmlFor */}
              Currently Available
            </label>
          </div>
        </div>
        <div className='requests-list'>
          {error && <center><p style={{ color: 'red' }}>{error}</p></center>}
          {!error && sentRequestsArray.length === 0 && (
            <center>
              <p>No requests found.</p>
            </center>
          )}
          {!error && sentRequestsArray.length > 0 && (
            sentRequestsArray.map((request) => (
              <SentChatRequestItem
                key={request.chatId}
                chatRequestItemDetails={request}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyContacts;
