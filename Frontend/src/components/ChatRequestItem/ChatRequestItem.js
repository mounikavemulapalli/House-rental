/** @format */

import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./ChatRequestItem.css";

import React from "react";

const ChatRequestItem = ({ chatRequestItemDetails, showChatView, onDeleteRequest }) => {
  const { chatId, propertyTitle, username } = chatRequestItemDetails;

  const handleAcceptRequest = async () => {
    const token = Cookies.get("jwt_token");
    const url = `http://localhost:4000/accept-chat-request/${chatId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    await axios.put(url, {}, { headers });
    showChatView(chatId, propertyTitle, username);
  };

  const handleRejectRequest = async () => {
    const token = Cookies.get("jwt_token");
    const url = `http://localhost:4000/delete-chat-request/${chatId}`; // Ensure this is correct
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    try {
      await axios.delete(url, { headers });
      onDeleteRequest(chatId); // Notify parent component to remove the request from the list
    } catch (error) {
      console.error("Error deleting chat request:", error);
    }
  };
  return (
    <div className="chat-request-item">
      <p>{propertyTitle} - {username}</p>
      <button onClick={handleAcceptRequest}>Accept</button>
      <button onClick={handleRejectRequest}>Reject</button>
    </div>
  );
};

export default ChatRequestItem;
