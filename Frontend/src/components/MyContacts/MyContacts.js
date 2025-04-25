/** @format */

import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";
import SentChatRequestItem from "../SentChatRequestItem/SentChatRequestItem";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import "./MyContacts.css";

const MyContacts = () => {
  const [sentRequestsArray, setSentRequestsArray] = useState([]);

  useEffect(() => {
    const getSentChatRequests = async () => {
      const token = Cookies.get("jwt_token");
      const url = "http://localhost:4000/sent-chat-requests";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });

      setSentRequestsArray(response.data);
    };
    getSentChatRequests();
  }, []);

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
          <div class='form-check form-switch'>
            <input
              class='form-check-input'
              type='checkbox'
              id='flexSwitchCheckDefault'
              checked
            />
            <label class='form-check-label' for='flexSwitchCheckDefault'>
              Currently Available
            </label>
          </div>
        </div>
        <div className='requests-list'>
          {sentRequestsArray.length === 0 ? (
            <center>
              <p>No requests</p>
            </center>
          ) : (
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
