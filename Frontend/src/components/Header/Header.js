/** @format */

import { Link, withRouter } from "react-router-dom";
import { Component } from "react";
import Cookies from "js-cookie";
import { CgProfile } from "react-icons/cg";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for hamburger menu
import "./Header.css";

class Header extends Component {
  state = {
    username: "",
    isMenuOpen: false, // State to manage mobile menu visibility
  };

  onClickLogout = () => {
    const { history } = this.props;
    Cookies.remove("jwt_token");
    history.replace("/login");
  };

  // getProfileData = async () => {
  //   try {
  //     const token = Cookies.get('jwt_token');
  //     if (token !== undefined) {
  //       const url = 'http://localhost:4000/user-profile';
  //       const options = {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       };
  //       const response = await fetch(url, options);
  //       const data = await response.json();
  //       const { username } = data;
  //       this.setState({ username });
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching profile data: ${error.message}`);
  //   }
  // };
  getProfileData = async () => {
    try {
      const token = Cookies.get("jwt_token");
      if (token !== undefined) {
        // const url =
        //   "http://localhost:4000/user-profile";
        const url = "http://localhost:4000/user-profile";
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        if (!text) {
          console.warn("Empty response body from profile endpoint");
          return;
        }

        const data = JSON.parse(text);
        const { username } = data;
        this.setState({ username });
      }
    } catch (error) {
      console.error(`Error fetching profile data: ${error.message}`);
    }
  };

  componentDidMount() {
    this.getProfileData();
  }

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  render() {
    const { username, isMenuOpen } = this.state;
    return (
      <nav className='header-nav-header'>
        <div className='header-nav-content'>
          {/* Logo and Hamburger Menu */}
          <div className='header-nav-bar-mobile-logo-container'>
            <Link to='/' className='header-shopper-logo-name'>
              <span>Sample App</span>
            </Link>
            <button
              type='button'
              className='header-menu-toggle-btn'
              onClick={this.toggleMenu}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className='header-nav-bar-large-container'>
            <Link to='/' className='header-shopper-logo-name'>
              <span>Sample App</span>
            </Link>
            <ul className='header-nav-menu'>
              <li className='header-nav-menu-item'>
                <Link to='/' className='header-nav-link'>
                  Home
                </Link>
              </li>
              <li className='header-nav-menu-item'>
                <Link to='/chat-requests' className='header-nav-link'>
                  Chat Requests
                </Link>
              </li>
              <li className='header-nav-menu-item'>
                <Link to='/add-property' className='header-nav-link'>
                  Add Properties
                </Link>
              </li>

              <li className='header-nav-menu-item'>
                <Link to='/profile/myProfile' className='header-nav-link'>
                  <CgProfile className='header-user-icon' /> {username}
                </Link>
              </li>

              <li className='header-nav-menu-item'>
                <button
                  type='button'
                  className='header-logout-desktop-btn'
                  onClick={this.onClickLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className='header-nav-menu-mobile'>
              <ul className='header-nav-menu-list-mobile'>
                <li className='header-nav-menu-item'>
                  <Link
                    to='/'
                    className='header-nav-link'
                    onClick={this.toggleMenu}
                  >
                    Home
                  </Link>
                </li>
                <li className='header-nav-menu-item-username'>{username}</li>
                <li className='header-nav-menu-item'>
                  <Link
                    to='/profile/myProfile'
                    className='header-nav-link'
                    onClick={this.toggleMenu}
                  >
                    <CgProfile className='header-user-icon' />
                  </Link>
                </li>
                <li className='header-nav-menu-item'>
                  <Link
                    to='/chat-requests'
                    className='header-nav-link'
                    onClick={this.toggleMenu}
                  >
                    Chat Requests
                  </Link>
                </li>
                <li className='header-nav-menu-item'>
                  <Link
                    to='/add-property'
                    className='header-nav-link'
                    onClick={this.toggleMenu}
                  >
                    Add Properties
                  </Link>
                </li>
                <li className='header-nav-menu-item'>
                  <button
                    type='button'
                    className='header-logout-mobile-btn'
                    onClick={this.onClickLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    );
  }
}

export default withRouter(Header);
