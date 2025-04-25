/*import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect,Link} from 'react-router-dom' 
import Navbar from '../Navbar'

import './index.css'

class RegisterForm extends Component {
  state = {
    username: '',
    password: '',
    showApiStatusText: false,
    apiStatusText: '',
    showPassword :false,
    email:''
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeEmail=event=>{
    this.setState({email:event.target.value})
  }

  onSubmitSuccess = () => {
    const {history} = this.props
   
    history.replace('/login')
  }

  toggleShowPassword = () => {
    this.setState((prev) => ({showPassword : !prev.showPassword}))
  };


  onSubmitFailure = errorMsg => {
   
    this.setState({showApiStatusText: true,
      apiStatusText: errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    this.setState({showApiStatusText:true,
      apiStatusText:"verifying...."
    })
    const url = 'https://gts-rental-app.onrender.com/register'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      
      this.onSubmitSuccess()
    } else {
      this.onSubmitFailure(data.errorMsg)
    }
  }

  renderPasswordField = () => {
    const {password,showPassword } = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type={showPassword ? 'text':'password'}
          id="password"
          className="password-input-field"
          value={password}
          required
          onChange={this.onChangePassword}
        />
        <div className='checkbox-container'>
            <input  className='password-checkbox'
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                   
                    onChange={this.toggleShowPassword}
                /> 
                Show Password
        </div>
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          required
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderEmailField = () => {
    const {email} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          EMAIL
        </label>
        <input
          type="text"
          id="email"
          className="username-input-field"
          value={email}
          required
          placeholder="example@domain.com"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          onChange={this.onChangeEmail}
        />
      </>
    )
  }

  render() {
    const {showApiStatusText, apiStatusText} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (<> 
        <Navbar/>
      <div className="login-form-container">
       
       
        <form className="form-container" onSubmit={this.submitForm}>
          <h1>SignUp</h1>
          <div className="input-container">{this.renderUsernameField()}</div>
          
         <div className="input-container">{this.renderEmailField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
         
          
          <button type="submit" className="login-button">
            Register
          </button>
          {showApiStatusText && <p className="error-message">*{apiStatusText}</p>}
          <p className='account-note-text'>Already Have an account ? <Link className="highlight-text" to="/login"><span >Login here</span></Link></p>
        </form>
      </div> </>
    )
  }
}

export default RegisterForm 
*/

import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Register.css";
import axios from "axios";

const RegisterForm = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9@$#_.]{4,}$/;
    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username = "Enter a Valid Username";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Phone number validation
    const phoneRegex = /^[6789]\d{9}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a Valid Phone Number";
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Enter a Valid Password";
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords did not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (validateForm()) {
  //     console.log("Form Data:", formData);
  //     // Add logic to send data to backend using Node.js and SQLite
  //     // const apiUrl="https://gts-rental-app.onrender.com/register"
  //     const apiUrl = "http://localhost:4000/register";
  //     const body = formData;
  //     try {
  //       const response = await axios.post(apiUrl, body);
  //       console.log(response);
  //       console.log(response.status);

  //       if (response.status === 201) {
  //         alert("Registration successful!");
  //         const { history } = props;

  //         history.replace("/login");
  //       } else {
  //         alert("Registration Failed!");
  //       }
  //     } catch (error) {
  //       console.error("Error during registration:", error);
  //       alert("An error occurred during registration. Please try again.");
  //     }
  //   }
  // };

  // Replace the existing handleSubmit function with this updated version
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Create request data without confirmPassword
      const requestData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber, // Ensure this matches the backend expected field name
      };

      try {
        const response = await axios.post(
          "http://localhost:4000/register",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          alert("Registration successful!");
          props.history.push("/login"); // Using push instead of replace
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        alert(errorMessage);
        console.error("Registration error:", error.response?.data);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className='login-form-container'>
        <form onSubmit={handleSubmit} className='form-container'>
          <h1>SignUp</h1>

          <div className='input-container'>
            <label className='input-label'>Username</label>
            <input
              type='text'
              name='username'
              value={formData.username}
              className='input-field'
              onChange={handleInputChange}
              placeholder='Enter your username'
            />
            {errors.username && (
              <p className='error-message'>{errors.username}</p>
            )}
            <p className='note-msg-text'>
              Username must have at least 4 characters and can include
              alphanumeric characters and @, $, #, ., _
            </p>
          </div>

          <div className='input-container'>
            <label className='input-label'>Email</label>
            <input
              type='email'
              name='email'
              className='input-field'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='Enter your email'
            />
            {errors.email && <p className='error-message'>{errors.email}</p>}
            <p className='note-msg-text'>e.g: user@example.com</p>
          </div>

          <div className='input-container'>
            <label className='input-label'>Phone Number</label>
            <input
              type='tel'
              name='phoneNumber'
              className='input-field'
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder='Enter your phone number'
              maxLength='10'
            />
            {errors.phoneNumber && (
              <p className='error-message'>{errors.phoneNumber}</p>
            )}
            <p className='note-msg-text'>
              Phone number must start with 6, 7, 8, or 9 and be exactly 10
              digits
            </p>
          </div>

          <div className='input-container'>
            <label className='input-label'>Password</label>
            <input
              type='password'
              name='password'
              className='input-field'
              minLength={8}
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Enter your password'
            />
            {errors.password && (
              <p className='error-message'>{errors.password}</p>
            )}
            <p className='note-msg-text'>
              Password must be at least 8 characters, include At least an
              uppercase letter and a special character
            </p>
          </div>

          <div className='input-container'>
            <label className='input-label'>Confirm Password</label>
            <input
              type='password'
              className='input-field'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder='Confirm your password'
            />
            {errors.confirmPassword && (
              <p className='error-message'>{errors.confirmPassword}</p>
            )}
          </div>

          <button type='submit' className='register-button'>
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
