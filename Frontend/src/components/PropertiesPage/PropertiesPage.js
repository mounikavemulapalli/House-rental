/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import "./PropertiesPage.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import image from "../../assets/images/no-properties.svg"; // Import the placeholder image

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchType, setSearchType] = useState("Available");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  // Get query params from the URL
  const locationSearch = useLocation();
  const queryParams = new URLSearchParams(locationSearch.search);
  const searchTypeParam = queryParams.get("search_type");
  const searchQuery = queryParams.get("query");
  console.log(searchQuery);
  console.log(searchType);

  useEffect(() => {
    setSearchType(searchTypeParam || "Available");
    setLocation(searchQuery || "");
    fetchProperties(searchTypeParam, searchQuery);
  }, [searchTypeParam, searchQuery]);

  // Fetch properties based on filters
  const fetchProperties = async (searchType, query) => {
    const token = Cookies.get("jwt_token");
    const url = `http://localhost:4000/properties?search_type=${searchType}&location=${query}&price=${price}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(url, { headers });
      setProperties(response.data);
      setFilteredProperties(response.data);
      console.log("api call made");
      console.log(response);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleFilterSubmit = async () => {
    const token = Cookies.get("jwt_token");

    const url = `http://localhost:4000/properties`;
    const body = {
      searchType,
      location,
      price,
    };
    console.log("hgf");
    console.log(body);
    console.log(token);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(url, body, { headers });

      setFilteredProperties(response.data);
    } catch (error) {
      console.error("Error fetching filtered properties:", error);
    }
  };

  const handleDelete = async (propertyId) => {
    const token = Cookies.get("jwt_token");
    const url = `http://localhost:4000/properties/${propertyId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      await axios.delete(url, { headers });
      setFilteredProperties(filteredProperties.filter(property => property.propertyId !== propertyId));
    } catch (error) {
      console.error("Error deleting property:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='propertiespage-container'>
      {/* Filter Sidebar */}
      <div className='propertiespage-filter-sidebar'>
        <h3>Filter</h3>
        <form>
          <div className='propertiespage-filter-option'>
            <label htmlFor='searchType'>Property Type:</label>
            <select
              id='searchType'
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value='Available'>Available</option>
              <option value='Sold'>Sold</option>
              <option value='Rented'>Rented</option>
            </select>
          </div>
          <div className='propertiespage-filter-option'>
            <label htmlFor='location'>Location:</label>
            <input
              type='text'
              id='location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder='Enter location'
            />
          </div>
          <div className='propertiespage-filter-option'>
            <label htmlFor='priceRange'>Price Range:</label>
            <input
              type='text'
              id='priceRange'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='e.g., 5000-10000'
            />
          </div>

          <button onClick={handleFilterSubmit}>Apply Filters</button>
        </form>
      </div>

      {/* Property Listings */}
      <div className='propertiespage-property-listings'>
        <h2>{searchType} Properties</h2>
        <div className='propertiespage-listing'>
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => {
              const imageUrl = property.wallpaperImage && property.wallpaperImage !== "null" 
                ? `http://localhost:4000/${property.wallpaperImage}` 
                : image;
              return (
                <div
                  className='propertiespage-property-card'
                  key={property.propertyId}
                >
                  {/* Image Section */}
                  <div className='propertiespage-property-photo'>
                    <img src={imageUrl} alt='Property Image' />
                  </div>
                  {/* Details Section */}
                  <div className='propertiespage-property-details'>
                    <div className='propertiespage-row'>
                      <h3 className='propertiespage-property-title'>
                        {property.propertyTitle}
                      </h3>
                    </div>
                    <div className='propertiespage-row'>
                      <p className='propertiespage-address'>
                        {property.location}
                      </p>
                    </div>
                    <div className='propertiespage-row'>
                      <p className='propertiespage-price'>
                        Price: ₹{property.price}
                      </p>
                      <p className='propertiespage-builtup'>
                        Built-up Area: 122{property.builtUpArea} sqft
                      </p>
                      <p className='propertiespage-property-status'>
                        Status: Available {property.propertyStatus}
                      </p>
                    </div>
                    <div className='propertiespage-row'>
                      <p className='propertiespage-description'>
                        {property.description}
                      </p>
                    </div>
                  </div>
                  {/* Buttons Section */}
                  <div className='propertiespage-action-buttons'>
                    <button className='propertiespage-view-details'>
                      <Link
                        className='propertiespage-action-buttons'
                        to={`/view-details?propertyId=${property.propertyId}`}
                      >
                        View Details
                      </Link>
                    </button>
                    <button className='propertiespage-save-property'>
                      Save Property
                    </button>
                    <button onClick={() => handleDelete(property.propertyId)}>Delete</button>
                    <button>Send Message Request</button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;