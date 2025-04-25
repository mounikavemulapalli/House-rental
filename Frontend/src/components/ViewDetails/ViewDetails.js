/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./ViewDetails.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ViewDetails = (props) => {
  const [propertyDetails, setPropertyDetails] = useState({
    imgUrl: "https://via.placeholder.com/600x400?text=Loading+Image", // Placeholder
    propertyTitle: "Loading...",
    price: "Loading...",
    description: "Fetching details...",
  });
  const PropertyMap = ({ latitude, longitude }) => {
    const defaultPosition = [20.5937, 78.9629]; // India's center coordinates

    return (
      <MapContainer
        center={latitude && longitude ? [latitude, longitude] : defaultPosition}
        zoom={latitude && longitude ? 16 : 5} // Zoom in for property, else wider view of India
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        {latitude && longitude && (
          <Marker position={[latitude, longitude]} icon={customIcon} />
        )}
      </MapContainer>
    );
  };

  const params = new URLSearchParams(props.location.search);
  const propertyId = params.get("propertyId");

  useEffect(() => {
    const getPropertyDetails = async () => {
      try {
        const token = Cookies.get("jwt_token");
        console.log(`Token in ViewDetails: ${token}`);
        console.log(`Property ID: ${propertyId}`);

        if (token !== undefined) {
          const url = `http://localhost:4000/property-details?propertyId=${propertyId}`;

          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };

          console.log("Fetching property details...");
          const response = await axios.get(url, { headers });

          // Update state with API response
          setPropertyDetails(response.data);
        }
      } catch (error) {
        console.error(`Error fetching View Details: ${error.message}`);
      }
    };

    getPropertyDetails();
  }, [propertyId]);

  return (
    <div className='container'>
      {/* Property Header */}
      <div className='property-header'>
        <h1>{propertyDetails.propertyTitle}</h1>
        <div className='price'>{propertyDetails.price}</div>
      </div>

      {/* Property Image */}
      <div className='gallery'>
        <img
          className='view-details-page-property-img'
          src={propertyDetails.imgUrl}
          alt='Property'
        />
      </div>

      {/* Property Details */}
      <div className='property-details'>
        <h2>Property Details</h2>
        <table>
          <tbody>
            <tr>
              <th>
                <i className='fas fa-bed'></i> No. of Bedrooms
              </th>
              <td>3</td>
            </tr>
            <tr>
              <th>
                <i className='fas fa-bath'></i> No. of Bathrooms
              </th>
              <td>2</td>
            </tr>
            <tr>
              <th>
                <i className='fas fa-ruler'></i> Size
              </th>
              <td>1,500 sq. ft.</td>
            </tr>
            <tr>
              <th>
                <i className='fas fa-car'></i> Parking
              </th>
              <td>Available</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Overview (Static Data) */}
      <div className='overview'>
        <h2>Overview</h2>
        <div className='overview-details'>
          <div className='overview-item'>
            <i className='fas fa-map-marker-alt'></i>
            <span>Location: Downtown, New York</span>
          </div>
          <div className='overview-item'>
            <i className='fas fa-home'></i>
            <span>Type: Apartment</span>
          </div>
        </div>
      </div>

      {/* Description (Fetched from Backend) */}
      <div className='details'>
        <h2>Description</h2>
        <p>{propertyDetails.description}</p>
      </div>

      {/* Amenities (Static Data) */}
      <div className='amenities'>
        <h2>Amenities</h2>
        <div className='amenities-list'>
          {[
            "Wi-Fi",
            "Gym",
            "Swimming Pool",
            "24/7 Security",
            "Pet Friendly",
          ].map((item, index) => (
            <div className='amenity-item' key={index}>
              <i className='fas fa-check-circle'></i>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='property-map'>
        <h2>Location</h2>
        <PropertyMap
          latitude={propertyDetails.mapLatitude}
          longitude={propertyDetails.mapLongitude}
        />
      </div>

      {/* Action Buttons */}
      <div className='action-buttons'>
        <button className='button owner-details-btn'>
          <i className='fas fa-user'></i> Get Owner Details
        </button>
        <button className='button schedule-visit-btn'>
          <i className='fas fa-calendar-alt'></i>
          <span className='tooltip-text'>Schedule a Visit</span>
        </button>
        <button className='button message-owner-btn'>
          <i className='fas fa-comment-alt'></i>
          <span className='tooltip-text'>Message Owner</span>
        </button>
      </div>
    </div>
  );
};

export default ViewDetails;
