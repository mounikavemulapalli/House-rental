/** @format */

// import axios from "axios";
// import Cookies from "js-cookie";
// import { useState } from "react";
// import "./PropertyItem.css";
// import { Link } from "react-router-dom";
// import image from "../../assets/images/no-properties.svg";

// const PropertyCard = (props) => {
//   const { propertyDetails, currentUserId } = props;
//   const { propertyId, propertyTitle, price, description, city, state, imgUrl, ownerId } = propertyDetails;

//   const jwtToken = Cookies.get("jwt_token");

//   const sendChatRequest = async () => {
//     const url = "http://localhost:4000/chat-request";
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${jwtToken}`,
//     };

//     const body = {
//       propertyId,
//     };

//     try {
//       const response = await axios.post(url, body, { headers });
//       if (response.status === 201) {
//         alert("Chat request sent successfully");
//       }
//     } catch (error) {
//       console.error("Error sending chat request:", error.response ? error.response.data : error.message);
//     }
//   };

//   const deleteProperty = async () => {
//     const url = `http://localhost:4000/properties/${propertyId}`;
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${jwtToken}`,
//     };

//     try {
//       const response = await axios.delete(url, { headers });
//       if (response.status === 200) {
//         alert("Property deleted successfully");
//         // Optionally refresh the list or remove the item from the UI
//       }
//     } catch (error) {
//       console.error("Error deleting property:", error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <li className='PropertyItem-property-card'>
//       <section className='PropertyItem-featured'>
//         <div className='PropertyItem-property-item'>
//           <div className='PropertyItem-property-card'>
//             <div className='PropertyItem-property-image-placeholder'>
//               <img src={imgUrl ? imgUrl : image} alt='Property Image' />
//             </div>
//             <div className='PropertyItem-property-info'>
//               <h3>{propertyTitle}</h3>
//               <p>
//                 {city}, {state}
//               </p>
//               <p>
//                 <strong>Price:</strong> {price}
//               </p>
//               <p>
//                 <strong>Description:</strong> {description}
//               </p>
//             </div>
//             {jwtToken && (
//               <div className='PropertyItem-view-btn'>
//                 <button type='button' onClick={sendChatRequest}>
//                   Send Chat Request
//                 </button>
//                 {currentUserId === ownerId && (
//                   <button type='button' onClick={deleteProperty}>
//                     Delete Property
//                   </button>
//                 )}
//                 <Link to={`/view-details?propertyId=${propertyId}`}>
//                   <button type='button'>View Details</button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </li>
//   );
// };

// export default PropertyCard;
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import "./PropertyItem.css";
import { Link } from "react-router-dom";
import image from "../../assets/images/no-properties.svg";

const PropertyCard = (props) => {
  const { propertyDetails, currentUserId } = props;
  const { propertyId, propertyTitle, price, description, city, state, imgUrl, ownerId } = propertyDetails;
  
  // Define imageUrl correctly
  const imageUrl = imgUrl ? `http://localhost:4000/uploads/${imgUrl}` : image;
  const jwtToken = Cookies.get("jwt_token");

  const sendChatRequest = async () => {
    const url = "http://localhost:4000/chat-request";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    };

    const body = {
      propertyId,
    };

    try {
      const response = await axios.post(url, body, { headers });
      if (response.status === 201) {
        alert("Chat request sent successfully");
      }
    } catch (error) {
      console.error("Error sending chat request:", error.response ? error.response.data : error.message);
    }
  };

  const deleteProperty = async () => {
    const url = `http://localhost:4000/properties/${propertyId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    };

    try {
      const response = await axios.delete(url, { headers });
      if (response.status === 200) {
        alert("Property deleted successfully");
        // Optionally refresh the list or remove the item from the UI
      }
    } catch (error) {
      console.error("Error deleting property:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <li className='PropertyItem-property-card'>
      <section className='PropertyItem-featured'>
        <div className='PropertyItem-property-item'>
          <div className='PropertyItem-property-card'>
            <div className='PropertyItem-property-image-placeholder'>
              <img src={imageUrl} alt='Property Image' />
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
                <button type='button' onClick={sendChatRequest}>
                  Send Chat Request
                </button>
                {currentUserId === ownerId && (
                  <button type='button' onClick={deleteProperty}>
                    Delete Property
                  </button>
                )}
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