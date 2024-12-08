import React, { useState, useEffect } from 'react';
import happyPeople from '../../Assets/happyPeople.png';
import butterflyIcon from '../../Assets/Butterfly.png'; // Assuming the butterfly image is stored in Assets
import { Mail, Lock, Heart, Building, PersonStanding } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';  // Import the hook
import { useAuth } from '../../hooks/AuthContext'


const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [facilityCode, setFacilityCode] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [showRegisterInfo, setShowRegisterInfo] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyPolicyAgreed, setIsPrivacyPolicyAgreed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isMentor, setIsMentor] = useState(false); // Tracks whether user is a mentor
  const [mentorCode, setMentorCode] = useState('');
  const [isMobile, setIsMobile] = useState(false);


  // State for feedback
  const [emailFeedback, setEmailFeedback] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [confirmPasswordFeedback, setConfirmPasswordFeedback] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, signUpWithEmail } = useAuth();


  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      setLoginError("Gelieve zowel je e-mailadres als wachtwoord op te geven.");
      return;
    }

    // Now login attempt
    loginWithEmail(loginEmail, loginPassword)
      .then((response) => {
        if (response.success) {
          setLoginError(''); // Clear error on successful login
          console.log('Logged in successfully:', response.user);
          navigate("/");
        } else {
          setLoginError(response.error);
          console.log('Login failed:', response.error);
        }
      })
      .catch((err) => {
        // In case an unexpected error occured outside of the function
        setLoginError('An unexpected error occurred.');
        console.error('Unexpected error:', err);
      });
  }

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    console.log("Sign up form submitted");  // Debugging line

    // Helper functions for validation
    const isValidFacilityCode = (facilityCode, selectedFacility) => {
      if (selectedFacility === "Bloemetje" && facilityCode !== "12345") return "Ongeldige faciliteitscode voor faciliteit Bloemetje. Toegang geweigerd.";
      if (selectedFacility === "De Regenboog" && facilityCode !== "67890") return "Ongeldige faciliteitscode voor faciliteit De Regenboog. Toegang geweigerd.";
      if (selectedFacility === "De Wensboom" && facilityCode !== "23390") return "Ongeldige faciliteitscode voor faciliteit De Wensboom. Toegang geweigerd.";
      if (selectedFacility === "De Witte Roos" && facilityCode !== "22489") return "Ongeldige faciliteitscode voor faciliteit De Witte Roos. Toegang geweigerd.";
      if (selectedFacility === "TienOpTien" && facilityCode !== "18234") return "Ongeldige faciliteitscode voor faciliteit TienOpTien. Toegang geweigerd.";
      if (selectedFacility === "De Kerselaar" && facilityCode !== "89251") return "Ongeldige faciliteitscode voor faciliteit De Kerselaar. Toegang geweigerd.";
      if (selectedFacility === "Jasmijntje" && facilityCode !== "90119") return "Ongeldige faciliteitscode voor faciliteit Jasmijntje. Toegang geweigerd.";
      if (selectedFacility === "De Springplank" && facilityCode !== "44557") return "Ongeldige faciliteitscode voor faciliteit De Springplank. Toegang geweigerd.";

      return null;
    };

    const isValidMentorCode = (mentorCode) => {
      // Example mentor code validation: it should be exactly 6 characters and alphanumeric
      const mentorCodeRegex = /^[A-Za-z0-9]{8}$/;
      if (!mentorCodeRegex.test(mentorCode)) {
        return "Ongeldige mentor code. De code moet precies 8 alfanumerieke tekens bevatten.";
      }
      // You can also add additional checks, such as checking if the code exists in a predefined list of mentor codes.
      const validMentorCodes = ["MENTOR01", "MENTOR02", "MENTOR03"];  // Example valid codes
      if (!validMentorCodes.includes(mentorCode)) {
        return "De mentor code is ongeldig. Gelieve een juiste code in te geven.";
      }
      return null;
    };

    const validateFields = () => {
      if (!signUpEmail || !signUpPassword || !confirmPassword || !isTermsAgreed || !isPrivacyPolicyAgreed || (isMentor ? !mentorCode : !facilityCode) || !selectedFacility) {
        return "Gelieve alle velden in te vullen en akkoord te gaan met de voorwaarden om je aan te melden.";
      }

      if (signUpPassword !== confirmPassword) {
        return "Wachtwoorden komen niet overeen.";
      }

      if (isMentor && !mentorCode) {
        return "Mentor code is verplicht.";
      }

      if (!isMentor && !facilityCode) {
        return "Faciliteitscode is verplicht.";
      }

      // Validate mentor code
      if (isMentor) {
        const mentorCodeError = isValidMentorCode(mentorCode);
        if (mentorCodeError) {
          return mentorCodeError;
        }
      }
      // Validate facility code
      else {
        const facilityCodeError = isValidFacilityCode(facilityCode, selectedFacility);
        if (facilityCodeError) {
          return facilityCodeError;
        }
      }

      return null;
    };

    let error = validateFields();
    if (error) {
      setSignupError(error);
      return;
    }

    // Call signUpWithEmail function if all validations pass
    signUpWithEmail(signUpEmail, signUpPassword, isMentor, selectedFacility)
      .then(async (response) => {
        if (response) {
          setSignupError(response.toString);
          return;
        }
      })
      .catch((error) => {
        console.error("Error during sign-up:", error);
        setSignupError("Er is een fout opgetreden tijdens het aanmelden.");
      });

    navigate('/completeProfile')
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    if (isLogin) {
      setLoginEmail(email);  // Update loginEmail if it's the login form
    } else {
      setSignUpEmail(email);  // Update signUpEmail if it's the signup form
    }

    // Improved email validation with regex
    const emailFeedback = !/\S+@\S+\.\S+/.test(email) ? 'Voer een geldig e-mailadres in.' : '';
    setEmailFeedback(emailFeedback);

    if (loginError) {
      setLoginError('');
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;

    if (isLogin) {
      // Update login password state if in login mode
      setLoginPassword(password);
    } else {
      // Update signup password state if in registration mode
      setSignUpPassword(password);
    }

    // Simple password validation feedback for registration
    if (password.length < 6) {
      setPasswordFeedback('Wachtwoord moet minstens 6 tekens lang zijn.');
    } else {
      setPasswordFeedback(null);
    }

    // If there is still an existing error, clear it
    if (loginError) {
      setLoginError(null);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const password = e.target.value;
    setConfirmPassword(password);

    // Simple password validation feedback for registration
    if (password.length < 6) {
      setConfirmPasswordFeedback('Wachtwoord moet minstens 6 tekens lang zijn.');
    } else {
      setConfirmPasswordFeedback('');
    }
  };

  useEffect(() => {
    if (loginError) {
      setLoginError(loginError); // Update local state if there's an error from App.js
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // If the width is less than or equal to 768px, it's a mobile view
    };

    // Listen to window resize events
    window.addEventListener('resize', handleResize);

    // Set initial layout based on screen size
    handleResize();

    return () => window.removeEventListener('resize', handleResize);

  }, [loginError]);


  return (
    <div className="flex flex-col">      {/* Split Layout Container */}
      <div className="min-h-screen flex flex-col md:flex-row items-cover">

        {/* Left Half */}
        <div className="flex md:flex-col justify-center items-center bg-rose-400">
          {!isMobile && (
            <img
              src={happyPeople}
              className="w-full h-1/2 object-cover"
            />
          )}

          {/* Content Section */}
          <div className="flex flex-col items-center justify-center h-full text-center p-12 font-poppins">
            <div className="flex flex-row items-center justify-start space-x-4">
              {isMobile && (
                <div className="bg-white rounded-full p-4 shadow-lg">
                  <img src={butterflyIcon} alt="Butterfly Icon" className="w-20 h-20" />
                </div>
              )}

              {/* Text Section */}
              <div className="text-left">
                <h1 className="text-rose-100 text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
                  V(l)inder
                </h1>
                <p className="text-rose-800 text-base font-medium md:text-xl drop-shadow-sm">
                  Find your perfect match
                </p>
              </div>
            </div>

            {/* Registration Info Prompt */}
            {showRegisterInfo && !isMobile && (
              <div className="mt-6 bg-white bg-opacity-90 shadow-lg rounded-lg p-5 max-w-md mx-auto w-auto">
                <h2 className="font-bold text-lg text-center text-[#e11d48] mb-4">
                  Sluit je nu aan en fladder het geluk tegemoet...
                </h2>
                <div className="flex flex-wrap justify-start items-center gap-4">
                  {[<Heart />, 'Inclusief', <Heart />, 'Veilig', <Heart />, 'Betrouwbaar', <Heart />].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showRegisterInfo && !isMobile && (
              <div className="flex justify-center items-center mt-4">
                <img src={butterflyIcon} alt="Butterfly icon" className="w-40 h-40" />
              </div>
            )}
          </div>
        </div>

        {/* Right Half */}
        <div className="w-full flex min-h-screen items-center justify-center p-12 bg-rose-50" >
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-[#be123c] text-center mb-8">{isLogin ? 'Welkom!' : 'Registreer'}</h2>

            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                  <Mail className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusEmail ? 'text-[#be123c]' : ''}`} />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusEmail(true)}
                    onBlur={() => setFocusEmail(false)}
                    className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                    placeholder="Email"
                    required
                  />
                </div>

                {emailFeedback &&
                  <div role="alert" className="flex items-center text-red-600 bg-red-100 border border-red-600 rounded p-2 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                    <p className="text-sm">{emailFeedback}</p>
                  </div>
                }

                {/* Password Input */}
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusPassword ? 'text-[#be123c]' : ''}`} />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusPassword(true)}
                    onBlur={() => setFocusPassword(false)}
                    className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                    placeholder="Wachtwoord"
                    required
                  />
                </div>

                {passwordFeedback &&
                  <div role="alert" className="flex items-center text-red-600 bg-red-100 border border-red-600 rounded p-2 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                    <p className="text-sm">{passwordFeedback}</p>
                  </div>
                }

                {/* Forgot Password Link */}
                <div className="text-right mt-2">
                  <a
                    href="/forgotPassword"
                    className="text-[#e11d48] hover:text-[#be123c] text-sm"
                  >
                    Wachtwoord vergeten?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loginPassword.length < 6}
                  className="w-full py-3 bg-[#e11d48] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-105"
                >
                  Log in
                </button>

                {/* Display login error if any */}
                {loginError &&
                  <div role="alert" className="flex items-center text-red-600 bg-red-100 border border-red-600 rounded p-2 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                    <p className="text-sm">{loginError}</p>
                  </div>
                }

              </form>
            ) : (
              <form onSubmit={handleSignUpSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusEmail ? 'text-[#be123c]' : ''}`}
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusEmail(true)}
                    onBlur={() => setFocusEmail(false)}
                    className={`w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${emailFeedback ? 'border-red-600 focus:ring-red-300' : 'focus:ring-[#fda4af]'
                      }`}
                    placeholder="Email"
                    required
                    aria-invalid={!!emailFeedback}
                  />
                  {emailFeedback &&
                    <div role="alert" className="flex items-center text-red-600 bg-red-100 border border-red-600 rounded p-2 mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"></path>
                      </svg>
                      <p className="text-sm">{emailFeedback}</p>
                    </div>
                  }
                </div>
                {/* Password Input */}
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusPassword ? 'text-[#be123c]' : ''}`}
                    aria-hidden="true"
                  />
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusPassword(true)}
                    onBlur={() => setFocusPassword(false)}
                    className={`w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none ${passwordFeedback ? 'border-red-600 ring-2 ring-red-300' :
                      signUpPassword && confirmPassword && signUpPassword === confirmPassword ? 'border-green-600 ring-2 ring-green-400' :
                        'ring-2 focus:ring-[#fda4af] border-gray-300'
                      }`}
                    placeholder="Wachtwoord"
                    required
                    aria-invalid={!!passwordFeedback}
                  />
                  {passwordFeedback &&
                    <div role="alert" className="flex items-center text-red-600 bg-red-100 border border-red-600 rounded p-2 mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"></path>
                      </svg>
                      <p className="text-sm">{passwordFeedback}</p>
                    </div>
                  }
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" aria-hidden="true" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none ${confirmPasswordFeedback ? 'border-red-600 ring-2 ring-red-300' :
                      signUpPassword && confirmPassword && signUpPassword === confirmPassword ? 'border-green-600 ring-2 ring-green-400' :
                        'ring-2 focus:ring-[#fda4af] border-gray-300'
                      }`}
                    placeholder="Bevestig Wachtwoord"
                    required
                    aria-invalid={!!confirmPasswordFeedback}
                  />
                  {confirmPasswordFeedback &&
                    <div role="alert" className="flex items-center text-red-600 bg-red-100 border border-red-600 rounded p-2 mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"></path>
                      </svg>
                      <p className="text-sm">{confirmPasswordFeedback}</p>
                    </div>
                  }
                </div>

                {/* Password Match Success Message */}
                {signUpPassword && confirmPassword && signUpPassword === confirmPassword && (
                  <div role="alert" className="flex items-center text-green-600 bg-green-100 border border-green-600 rounded p-2 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <p className="text-sm">De wachtwoorden zijn een match!</p>
                  </div>
                )}

                {/* Mentor Checkbox */}
                <div className="mt-4 mb-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isMentor}
                      onChange={() => setIsMentor(!isMentor)}
                      className="h-4 w-4 text-[#e11d48] focus:ring-[#fda4af]"
                    />
                    <span className="font-bold">Ik ben een mentor</span>
                  </label>
                </div>

                {/* Facility/Mentor Code */}
                {!isMentor ? (
                  <>
                    <div className="mb-4 text-lg text-gray-600">
                      <span>Vul de faciliteitscode in die je hebt ontvangen van je begeleider of organisatie. (*)</span>
                    </div>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-5 h-5 text-gray-500" aria-hidden="true" />
                      <input
                        type="text"
                        value={facilityCode}
                        onChange={(e) => setFacilityCode(e.target.value)}
                        className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                        placeholder="Faciliteitscode"
                        required={!isMentor}
                        disabled={isMentor}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 text-lg text-gray-600">
                      <span>Geef je mentor ID in. (*)</span>
                    </div>
                    <div className="relative">
                      <PersonStanding className="absolute left-3 top-3 w-5 h-5 text-gray-500" aria-hidden="true" />
                      <input
                        type="text"
                        value={mentorCode}
                        onChange={(e) => setMentorCode(e.target.value)}
                        className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                        placeholder="Mentorcode"
                        required={isMentor}
                      />
                    </div>
                  </>
                )}

                {/* Facility Dropdown */}
                <div className="mb-6">
                  <label htmlFor="facility" className="text-sm text-[#be123c]">
                    Duid aan in welke faciliteit je verblijft:
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="facility"
                      value={selectedFacility}
                      onChange={(e) => setSelectedFacility(e.target.value)}
                      className="w-full py-4 pl-4 pr-10 text-sm border border-gray-300 rounded-lg bg-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                      required
                    >
                      <option value="" disabled>
                        Selecteer je faciliteit
                      </option>
                      <option value="Bloemetje">Bloemetje</option>
                      <option value="De Regenboog">De Regenboog</option>
                      <option value="De Wensboom">De Wensboom</option>
                      <option value="De Witte Roos">De Witte Roos</option>
                      <option value="TienOpTien">TienOpTien</option>
                      <option value="De Kerselaar">De Kerselaar</option>
                      <option value="Jasmijntje">Jasmijntje</option>
                      <option value="De Springplank">De Springplank</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5H7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions Agreement */}
                <div className="flex items-center mb-4">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    checked={isTermsAgreed}
                    onChange={(e) => setIsTermsAgreed(e.target.checked)}
                    className="h-4 w-4 text-[#e11d48] focus:ring-[#fda4af]"
                    required
                  />
                  <label
                    htmlFor="terms-checkbox"
                    className="ml-2 text-gray-600 text-sm cursor-pointer"
                  >
                    Ik ga akkoord met de{' '}
                    <a
                      href="#"
                      className="text-[#e11d48]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowTermsModal(true);
                      }}
                    >
                      Terms and Conditions
                    </a>.
                  </label>
                </div>

                {/* Privacy Policy Agreement */}
                <div className="flex items-center mb-4">
                  <input
                    id="privacy-checkbox"
                    type="checkbox"
                    checked={isPrivacyPolicyAgreed}
                    onChange={(e) => setIsPrivacyPolicyAgreed(e.target.checked)}
                    className="h-4 w-4 text-[#e11d48] focus:ring-[#fda4af]"
                    required
                  />
                  <label
                    htmlFor="privacy-checkbox"
                    className="ml-2 text-gray-600 text-sm cursor-pointer"
                  >
                    Ik ga akkoord met de{' '}
                    <a
                      href="#"
                      className="text-[#e11d48]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPrivacyModal(true);
                      }}
                    >
                      Privacy Policy
                    </a>.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#f43f5e] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={
                    !isTermsAgreed ||
                    !isPrivacyPolicyAgreed ||
                    (isMentor ? !mentorCode : !facilityCode) ||
                    !signUpEmail ||
                    !signUpPassword ||
                    !confirmPassword ||
                    !selectedFacility
                  }
                >
                  Registreer
                </button>

                {/* Error message display */}
                {signupError && (
                  <p className="text-red-600 text-xs mt-4">{signupError}</p>
                )}
              </form>
            )}

            <div className="text-center mt-8">
              {isLogin ? (
                <p className="text-gray-600">
                  Heb je nog geen account?{' '}
                  <button
                    className="text-[#e11d48] hover:text-[#be123c] font-bold"
                    onClick={() => { setIsLogin(false); setShowRegisterInfo(true); }}
                  >
                    Registreer hier
                  </button>
                  <br />
                  <span className="text-sm font-semibold mt-2 block">
                    (faciliteitscode vereist)
                  </span>
                </p>
              ) : (
                <p className="text-gray-600">
                  Heb je al een account?{' '}
                  <button
                    className="text-[#e11d48] hover:text-[#be123c] font-bold"
                    onClick={() => { setIsLogin(true); setShowRegisterInfo(false); }}
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        {
          showTermsModal && (
            <div className="fixed inset-0 bg-[#881337] bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-11/12 max-w-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-[#be123c]">Algemene Voorwaarden</h2>
                <div className="mb-6 overflow-y-scroll h-64 p-4 border rounded-lg">
                  <p className="text-gray-600">
                    Welkom op ons platform. Door onze diensten te gebruiken, stem je ermee in zich te houden aan de volgende voorwaarden:
                    <br /><br />
                    1. <strong>Aanvaarding van de Voorwaarden:</strong> Door een account aan te maken, ga je akkoord met deze voorwaarden en eventuele wijzigingen.
                    <br /><br />
                    2. <strong>Privacybeleid:</strong> Je persoonlijke gegevens worden beschermd volgens ons privacybeleid.
                    <br /><br />
                    3. <strong>Accountverantwoordelijkheden:</strong> Je zowel als de begeleider die je toegewezen werd, zijn verantwoordelijk voor het bewaren van de vertrouwelijkheid van jouw account.
                    <br /><br />
                    4. <strong>Verboden Activiteiten:</strong> Je mag zich niet bezighouden met illegale of schadelijke activiteiten op dit platform.
                    <br /><br />
                    5. <strong>Beëindiging:</strong> Wij behouden ons het recht voor om jouw account op elk moment te schorsen of te beëindigen.
                    <br /><br />
                    Enzovoort...
                  </p>
                </div>
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    className="mr-2"
                    checked={isTermsAgreed}
                    onChange={() => setIsTermsAgreed(!isTermsAgreed)}
                  />
                  <label htmlFor="agreeTerms" className="text-gray-600">
                    Ik heb de algemene voorwaarden gelezen en ga akkoord
                  </label>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className={`w-full py-3 text-white ${isTermsAgreed ? 'bg-[#e11d48]' : 'bg-gray-400 cursor-not-allowed'} rounded-lg transition-transform duration-300`}
                  disabled={!isTermsAgreed}
                >
                  Accepteer
                </button>
              </div>
            </div>
          )
        }

        {
          showPrivacyModal && (
            <div className="fixed inset-0 bg-[#881337] bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-11/12 max-w-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-[#be123c]">Privacy Policy</h2>
                <div className="mb-6 overflow-y-scroll h-64 p-4 border rounded-lg">
                  <p className="text-gray-600">
                    Welkom op ons platform. Door onze diensten te gebruiken, stem je ermee in zich te houden aan de volgende voorwaarden:
                    <br /><br />
                    1. <strong>Aanvaarding van de Voorwaarden:</strong> Door een account aan te maken, ga je akkoord met deze voorwaarden en eventuele wijzigingen.
                    <br /><br />
                    2. <strong>Privacybeleid:</strong> jouw persoonlijke gegevens worden beschermd volgens ons privacybeleid.
                    <br /><br />
                    3. <strong>Accountverantwoordelijkheden:</strong> Je zowel als de begeleider die je toegewezen werd, zijn verantwoordelijk voor het bewaren van de vertrouwelijkheid van jouw account.
                    <br /><br />
                    4. <strong>Verboden Activiteiten:</strong> Je mag zich niet bezighouden met illegale of schadelijke activiteiten op dit platform.
                    <br /><br />
                    5. <strong>Beëindiging:</strong> Wij behouden ons het recht voor om jouw account op elk moment te schorsen of te beëindigen.
                    <br /><br />
                    Enzovoort...
                  </p>
                </div>
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="agreePrivacyPolicy"
                    className="mr-2"
                    checked={isPrivacyPolicyAgreed}
                    onChange={() => setIsPrivacyPolicyAgreed(!isPrivacyPolicyAgreed)}
                  />
                  <label htmlFor="agreePrivacyPolicy" className="text-gray-600">
                    Ik heb de privacy policy gelezen en ga akkoord.
                  </label>
                </div>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className={`w-full py-3 text-white ${isPrivacyPolicyAgreed ? 'bg-[#e11d48]' : 'bg-gray-400 cursor-not-allowed'} rounded-lg transition-transform duration-300`}
                  disabled={!isPrivacyPolicyAgreed}
                >
                  Accepteer
                </button>
              </div>
            </div>
          )
        }
      </div >
    </div >
  );
};

export default LoginRegister;