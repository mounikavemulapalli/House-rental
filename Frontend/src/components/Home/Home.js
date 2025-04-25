/** @format */

import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Header from "../Header/Header";
import Cookies from "js-cookie";
import PropertyCard from "../PropertyItem/PropertyItem.js";
import axios from "axios";
import { io } from "socket.io-client";
import "./Home.css";
import Navbar from "../Navbar/Navbar.js";

const Home = () => {
  const [propertiesArray, setPropertiesArray] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("Fetching...");
  const [searchType, setSearchType] = useState("rent");
  const [searchQuery, setSearchQuery] = useState("");

  const token = Cookies.get("jwt_token");

  useEffect(() => {
    const getProperties = async () => {
      try { // Add try block
        const token = Cookies.get("jwt_token");
        const url = "http://localhost:4000/properties"; // Or "/properties" if using proxy

        const headers = {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // This route doesn't need auth, can be removed for testing
        };

        // Remove headers if testing without auth:
        // const response = await axios.get(url);
        const response = await axios.get(url, { headers });

        console.log("Properties fetched:", response.data); // Log success
        setPropertiesArray(response.data);

      } catch (error) { // Add catch block
        console.error("Error fetching properties:", error); // Log the full error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
        // Optionally set state to show an error message to the user
        // setPropertiesArray([]); // Clear properties on error
      }
    };

    getProperties();

    // WebSocket connection
    const socket = io("http://localhost:4000", {
      path: "/socket.io", // Same WebSocket path as server
      transports: ["websocket", "polling"], // Include polling
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
    });

    // Listen for new property events
    socket.on("newProperty", (newProperty) => {
      setPropertiesArray((prevProperties) => [...prevProperties, newProperty]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Get Current Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              if (data && data.address) {
                const address = `${data.address.road || ""}, ${
                  data.address.village || ""
                }, ${data.address.county || ""}, ${data.address.country || ""}`;
                console.log(address);
                setCurrentLocation(address);
              } else {
                setCurrentLocation("Address not found.");
              }
            })
            .catch(() => setCurrentLocation("Error fetching address."));
        },
        () => setCurrentLocation("Location access denied or unavailable.")
      );
    } else {
      setCurrentLocation("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      {token === undefined ? <Navbar /> : <Header />}
      <div
        className='title-container'
        style={{
          backgroundImage: `url('/assets/images/hometitlemenubg.svg')`,
        }}
      >
        <p className='first-title'>
          Your Dream{" "}
          <span style={{ color: "#800500", fontWeight: "bold" }}>
            Home Awaits
          </span>{" "}
          Here For You
          <br />
          <span className='tagline'>Gruhalābhaṁ Bhavatu Śubhaṁ</span>
        </p>

        <div className='search-container'>
          <div className='row-buttons'>
            <input
              type='radio'
              id='rent'
              name='search_type'
              value='rent'
              checked={searchType === "rent"}
              onChange={(e) => setSearchType(e.target.value)}
            />
            <label
              className={`btn ${searchType === "rent" ? "active" : ""}`}
              htmlFor='rent'
            >
              Rent
            </label>

            <input
              type='radio'
              id='buy'
              name='search_type'
              value='Sale'
              checked={searchType === "Sale"}
              onChange={(e) => setSearchType(e.target.value)}
            />
            <label
              className={`btn ${searchType === "Sale" ? "active" : ""}`}
              htmlFor='buy'
            >
              Buy
            </label>

            <input
              type='radio'
              id='commercial'
              name='search_type'
              value='Commercial'
              checked={searchType === "Commercial"}
              onChange={(e) => setSearchType(e.target.value)}
            />
            <label
              className={`btn ${searchType === "Commercial" ? "active" : ""}`}
              htmlFor='commercial'
            >
              Commercial
            </label>
          </div>

          <div className='row-search'>
            <input
              type='text'
              className='search-bar'
              placeholder='Enter your location...'
              name='search_query'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link
              to={`/properties?search_type=${searchType}&location=${searchQuery}`}
              className='btn-find'
            >
              <i className='fas fa-magnifying-glass'></i> Find
            </Link>
          </div>

          <div className='row-location'>
            <p className='current-location'>
              Your Current Location:{" "}
              <span id='current-location'>{currentLocation}</span>
            </p>
          </div>
        </div>
      </div>

      <div className='home-body'>
        <section className='featured'>
          <h2>Featured Properties</h2>
          <div className='property-grid'>
            {propertiesArray.map((eachItem) => (
              <PropertyCard
                key={eachItem.propertyId}
                propertyDetails={eachItem}
              />
            ))}
          </div>
        </section>

        <section className='testimonials'>
          <h2>What Our Clients Say</h2>
          <div className='testimonial-cards'>
            <div className='testimonial-card'>
              <p>
                "I found the perfect home thanks to RentalHouse! The process was
                smooth and quick!"
              </p>
              <span>- Sarah, Happy Client</span>
            </div>
            <div className='testimonial-card'>
              <p>
                "A seamless experience. The listings are always up to date and
                trustworthy."
              </p>
              <span>- John, Happy Renter</span>
            </div>
            <div className='testimonial-card'>
              <p>
                "The customer service was exceptional. I got all my questions
                answered in no time."
              </p>
              <span>- Emily, Home Seeker</span>
            </div>
          </div>
        </section>

        <section className='newsletter'>
          <h2>Stay Updated with Our Latest Listings</h2>
          <p>
            Subscribe to our newsletter to get the newest properties delivered
            directly to your inbox.
          </p>
          <div className='newsletter-form'>
            <input
              type='email'
              placeholder='Enter your email address'
              required
            />
            <button className='cta-btn'>Subscribe</button>
          </div>
        </section>

        <section className='why-us'>
          <h2>Why Choose Us?</h2>
          <div className='features'>
            <div className='feature'>
              <img src='/assets/images/badges/verified.png' alt='Verified' />
              <h3>Verified Listings</h3>
              <p>Our properties are verified for safety and quality.</p>
            </div>
            <div className='feature'>
              <img
                src='/assets/images/badges/primelocation.png'
                alt='Prime Location'
              />
              <h3>Prime Locations</h3>
              <p>Find rentals in the best neighborhoods in the city.</p>
            </div>
            <div className='feature'>
              <img src='/assets/images/badges/support.png' alt='Support' />
              <h3>24/7 Support</h3>
              <p>Our team is here to help you every step of the way.</p>
            </div>
          </div>
        </section>

        <section className='cta'>
          <h2>Ready to Find Your New Home?</h2>
          <button className='cta-btn'>Get Started</button>
        </section>
      </div>
    </>
  );
};

export default Home;
