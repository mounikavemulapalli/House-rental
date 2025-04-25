/** @format */

import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import "./PropertyItem.css";
import { Link } from "react-router-dom";
import image from "../../assets/images/no-properties.svg";

const PropertyCard = (props) => {
  const { propertyDetails } = props;

  const [isShowChatRequestStatus, setIsShowChatRequestStatus] = useState(false);

  const { propertyId, propertyTitle, price, description, city, state, imgUrl } =
    propertyDetails;
  var status = "pending";
  var { status } = propertyDetails;
  const [propertyStatus, setPropertyStatus] = useState(status);

  const jwtToken = Cookies.get("jwt_token");
  const sendChatRequest = async () => {
    const token = Cookies.get("jwt_token");
    const url = "http://localhost:4000/chat-request";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const body = {
      propertyId,
    };

    const response = await axios.post(url, body, { headers });
    if (response.status === 201) {
      setIsShowChatRequestStatus(true);
      setPropertyStatus("pending");
    }
  };
  const onClickChat = () => {
    sendChatRequest();
  };

  return (
    <li className='PropertyItem-property-card'>
      <section className='PropertyItem-featured'>
        <div className='PropertyItem-property-item'>
          <div className='PropertyItem-property-card'>
            <div className='PropertyItem-property-image-placeholder'>
              <img src={imgUrl} alt='Property Image' />
            </div>
            <div className='PropertyItem-property-info'>
              <h3>{propertyTitle}</h3>
              <p>
                {city}, {state}
              </p>
              <p>
                <strong>Price:</strong> {price}
              </p>
              <p>
                <strong>Description:</strong> {description}
              </p>
            </div>
            {jwtToken && (
              <div className='PropertyItem-view-btn'>
                <button type='button' onClick={onClickChat}>
                  Chat Request
                </button>
                <Link to={`/view-details?propertyId=${propertyId}`}>
                  <button type='button'>View Details</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </li>
  );
};

export default PropertyCard;
