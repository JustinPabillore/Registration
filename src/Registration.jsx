import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import DOMPurify from 'dompurify';
import './Registration.css';

function Registration() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    purpose: '',
  });

  const [submittedData, setSubmittedData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    purpose: '',
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message

  const capitalizeFirstWord = (value) => {
    if (!value) return '';
    const words = value.split(' ');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const handleInputChange = (field, value) => {
    let capitalizedValue = value;

    // Basic input validation: Disallow numbers or special characters in names
    const namePattern = /^[A-Za-z\s]*$/; // Only allow letters and spaces for names
    if (['firstName', 'middleName', 'lastName'].includes(field) && !namePattern.test(value)) {
      setErrorMessage('Please enter valid alphabetic characters only.');
      return;
    }

    // Capitalization rules
    if (field === 'firstName' || field === 'middleName' || field === 'lastName') {
      capitalizedValue = capitalizeFirstWord(value);
    } else if (field === 'address' || field === 'purpose') {
      if (value.length > 0 && value[0] === value[0].toLowerCase()) {
        capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
      }
    }

    setErrorMessage(''); // Clear error message when input is valid
    setFormData({
      ...formData,
      [field]: capitalizedValue,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Sanitize all fields before using them
    const sanitizedData = {
      firstName: DOMPurify.sanitize(formData.firstName),
      middleName: DOMPurify.sanitize(formData.middleName),
      lastName: DOMPurify.sanitize(formData.lastName),
      address: DOMPurify.sanitize(formData.address),
      purpose: DOMPurify.sanitize(formData.purpose),
    };

    // Check if all required fields are filled and valid
    if (
      sanitizedData.firstName.trim() === '' ||
      sanitizedData.lastName.trim() === '' ||
      sanitizedData.address.trim() === '' ||
      sanitizedData.purpose.trim() === ''
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    // Ensure length and content checks (for address/purpose)
    if (sanitizedData.address.length < 5) {
      setErrorMessage('Address must be at least 5 characters.');
      return;
    }

    if (sanitizedData.purpose.length < 3) {
      setErrorMessage('Purpose must be at least 3 characters.');
      return;
    }

    // Capitalize each part of the submitted data
    const capitalizedData = {
      firstName: capitalizeFirstWord(sanitizedData.firstName),
      middleName: sanitizedData.middleName ? capitalizeFirstWord(sanitizedData.middleName) : '',
      lastName: capitalizeFirstWord(sanitizedData.lastName),
      address: capitalizeFirstWord(sanitizedData.address),
      purpose: capitalizeFirstWord(sanitizedData.purpose),
    };

    // Store the sanitized and capitalized data
    setSubmittedData(capitalizedData);

    setShowQRCode(true);
    setCountdown(30); // Start the countdown from 30 seconds

    // Clear form data after submission
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      address: '',
      purpose: '',
    });

    setErrorMessage(''); // Clear error after successful submission
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && showQRCode) {
      setShowQRCode(false);
    }
    return () => clearInterval(timer);
  }, [countdown, showQRCode]);

  return (
    <div className="main-container3">
      <div className="top-container1">
        <label className="main-title">VISITOR REGISTRATION</label>
      </div>
      <div className="mid1-container">
        <span className="mid1-text">
          UNIVERSITY OF SCIENCE AND TECHNOLOGY OF SOUTHERN PHILIPPINES MONITORING SYSTEM
        </span>
      </div>
      <div className="bottom-container">
        <div className="left-container">
          <div className="m-box">
            <div className="m-box-title">REGISTER</div>
            <form className="form" onSubmit={handleFormSubmit}>
              <input
                type="text"
                className="input-fields"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required // Required attribute
              />
              <input
                type="text"
                className="input-fields"
                placeholder="Middle Name (Optional)"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
              />
              <input
                type="text"
                className="input-fields"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required // Required attribute
              />
              <input
                type="text"
                className="input-fields"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required // Required attribute
              />
              <input
                type="text"
                className="input-fields"
                placeholder="Purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                required // Required attribute
              />

              {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message */}

              <button type="submit" className="r-submit-button">
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="right-container">
          <div className="m-box">
            <div className="m-box-title">QR CODE</div>
            {showQRCode && (
              <>
                <QRCode
                  value={`${submittedData.firstName} ${submittedData.middleName} ${submittedData.lastName}`}
                  size={250}
                />
                <div className="notice">
                  <p>This code will expire in {countdown} seconds.</p>
                </div>
                <div className="notice2">
                  <p>PLEASE TAKE A PICTURE AND USE IT TO</p>
                  <p>ENTER AND EXIT THE CAMPUS. THANK YOU!</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
