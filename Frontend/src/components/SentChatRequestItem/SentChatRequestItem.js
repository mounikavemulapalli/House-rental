/** @format */

import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SentChatRequestItem = ({
  chatRequestItemDetails,
  showChatView,
  onCancelRequest,
}) => {
  const { chatId, propertyTitle, username, imgUrl } = chatRequestItemDetails;

  const cancelRequest = async () => {
    const token = Cookies.get("jwt_token");
    const url = `http://localhost:4000/cancel-chat-request/${chatId}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.delete(url, { headers });
      if (response.status === 200) {
        alert("Chat request canceled successfully!");
        onCancelRequest(chatId); // Notify parent component to update the UI
      }
    } catch (error) {
      console.error("Error canceling chat request:", error);
      alert("Failed to cancel chat request. Please try again.");
    }
  };

  return (
    <div
      className='sent-chat-request-item'
      onClick={() => showChatView(chatId, propertyTitle, username)}
    >
      <img src={imgUrl} alt='Property' className='property-image' />
      <div>
        <h4>{propertyTitle}</h4>
        <p>To: {username}</p>
        {/* Add the Cancel button */}
        <button onClick={cancelRequest} className='cancel-button'>
          Cancel Request
        </button>
      </div>
    </div>
  );
};

export default SentChatRequestItem;
