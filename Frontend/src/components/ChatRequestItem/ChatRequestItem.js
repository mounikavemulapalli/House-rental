/** @format */

import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./ChatRequestItem.css";

const ChatRequestItem = ({ chatRequestItemDetails, showChatView }) => {
  const { chatId, propertyTitle, username, imgUrl } = chatRequestItemDetails;

  return (
    <div
      className='chat-request-item'
      onClick={() => showChatView(chatId, propertyTitle, username)}
    >
      <img src={imgUrl} alt='Property' className='property-image' />
      <div>
        <h4>{propertyTitle}</h4>
        <p>From: {username}</p>
      </div>
    </div>
  );
};

export default ChatRequestItem;
