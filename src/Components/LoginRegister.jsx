import React, { useState } from 'react';
import happyPeople from '../Assets/happyPeople.png';
import butterflyIcon from '../Assets/Butterfly.png'; // Assuming the butterfly image is stored in Assets
import { Mail, Lock } from 'lucide-react';

const LoginRegister = ({ loginWithEmail, signUpWithEmail }) => {
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
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  // State for feedback
  const [emailFeedback, setEmailFeedback] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [confirmPasswordFeedback, setConfirmPasswordFeedback] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Please provide both email and password.");
      return;
    }
    loginWithEmail(loginEmail, loginPassword)
      .catch(() => setLoginError("Invalid login credentials. Please try again."));
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
  
    if (!signUpEmail || !signUpPassword || !confirmPassword || !isTermsAgreed || !facilityCode || !selectedFacility) {
      setSignupError("Please fill out all fields and agree to the terms for sign up.");
      return;
    }
  
    if (signUpPassword !== confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }
  
    // Validate the facility code and selected facility
    if (selectedFacility === "facility1" && facilityCode !== "12345") {
      setSignupError("Invalid facility code for Facility 1.");
      return;
    }
    if (selectedFacility === "facility2" && facilityCode !== "67890") {
      setSignupError("Invalid facility code for Facility 2.");
      return;
    }
    if (selectedFacility === "facility3" && facilityCode !== "ABCDEF") {
      setSignupError("Invalid facility code for Facility 3.");
      return;
    }
  
    // Call signUpWithEmail function if all validations pass
    signUpWithEmail(signUpEmail, signUpPassword, facilityCode)
      .then(() => setSignupError(''))
      .catch(() => setSignupError("Sign up failed. Please try again."));
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    if (isLogin) {
      setLoginEmail(email);  // Update loginEmail if it's the login form
    } else {
      setSignUpEmail(email);  // Update signUpEmail if it's the signup form
    }

    // Simple email validation feedback for both fields
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailFeedback('Please enter a valid email address.');
    } else {
      setEmailFeedback('');
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setSignUpPassword(password);
    // Simple password validation feedback
    if (password.length < 6) {
      setPasswordFeedback('Password must be at least 6 characters long.');
    } else {
      setPasswordFeedback('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const password = e.target.value;
    setConfirmPassword(password);
    // Confirm password feedback
    if (password !== signUpPassword) {
      setConfirmPasswordFeedback('Passwords do not match.');
    } else {
      setConfirmPasswordFeedback('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Split Layout Container */}
      <div className="flex flex-1">
        {/* Left Half */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-[#fda4af] to-[#f43f5e] relative py-10">
          <div
            className="absolute top-0 right-0 bottom-0 left-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: `url(${happyPeople})`, filter: 'blur(5px)' }}
          ></div>

          {/* Title with Animation */}
          <div className={`relative z-10 text-center font-poppins transition-all duration-700 ${isLogin ? 'mt-0' : 'mt-[-150px]'}`}>
            <h1 className="text-[#ffe4e6] text-6xl font-bold mb-4">V(l)inder</h1>
            <p className="text-[#fff1f2] text-lg mb-6">Find your perfect match</p>

            {/* Registration Info Prompt */}
            {showRegisterInfo && (
              <div className="mt-6 bg-white bg-opacity-80 shadow-md rounded-lg p-4 max-w-full mx-auto">
                <h2 className="font-bold text-lg text-center text-[#e11d48]">Sluit je nu aan en fladder het geluk tegemoet...</h2>
                <div className="flex justify-center items-center mt-2 gap-4 w-full">
                  <span className="flex items-center">
                    ❤️ <strong className="ml-2">Inclusief</strong>
                  </span>
                  <span className="flex items-center">
                    ❤️ <strong className="ml-2">Veilig</strong>
                  </span>
                  <span className="flex items-center">
                    ❤️ <strong className="ml-2">Betrouwbaar</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Right Half */}
        <div className="w-1/2 flex flex-col justify-center p-12" style={{ backgroundColor: '#fbf6f0' }} >
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-[#be123c] text-center mb-8">{isLogin ? 'Welkom!' : 'Registreer'}</h2>

            {/* Position the butterfly icon in the top-right corner of the screen */}
            <img
              src={butterflyIcon}
              alt="Butterfly Icon"
              className="absolute top-4 right-4 w-12 h-12 opacity-70"
            />

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

                {/* Password Input */}
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusPassword ? 'text-[#be123c]' : ''}`} />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onFocus={() => setFocusPassword(true)}
                    onBlur={() => setFocusPassword(false)}
                    className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                    placeholder="Paswoord"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#e11d48] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-105"
                >
                  Log in
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUpSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                  <Mail className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusEmail ? 'text-[#be123c]' : ''}`} />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusEmail(true)}
                    onBlur={() => setFocusEmail(false)}
                    className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                    placeholder="Email"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 w-5 h-5 text-gray-500 ${focusPassword ? 'text-[#be123c]' : ''}`} />
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusPassword(true)}
                    onBlur={() => setFocusPassword(false)}
                    className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                    placeholder="Paswoord"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className={`absolute left-3 top-3 w-5 h-5 text-gray-500`} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                    placeholder="Bevestig Paswoord"
                    required
                  />
                </div>

                {confirmPasswordFeedback && <p className="text-red-600 text-sm mt-1">{confirmPasswordFeedback}</p>}

                {/* Facility Code Instructions */}
                {!isLogin && (
                  <div className="mb-4 text-sm text-gray-600">
                    <span>Vul de faciliteitscode in die je hebt ontvangen van je begeleider of organisatie. (*)</span>
                  </div>
                )}

                {/* Facility Code Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={facilityCode}
                    onChange={(e) => setFacilityCode(e.target.value)}
                    className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                    placeholder="Faciliteitscode"
                    required
                  />
                </div>

                {/* Facility Dropdown */}
                <div className="mb-6">
                  <label htmlFor="facility" className="text-lg text-[#be123c]">
                    Duid aan in welke faciliteit u verblijft:
                  </label>
                  <div className="relative mt-2">
                  <select
                    id="facility"
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full py-4 pl-4 pr-10 text-sm border border-gray-300 rounded-lg bg-gray-100 appearance-none"
                    required
>
                      <option value="" disabled selected>
                        Selecteer uw faciliteit
                      </option>
                      <option value="facility1">Facility 1</option>
                      <option value="facility2">Facility 2</option>
                      <option value="facility3">Facility 3</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5H7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isTermsAgreed}
                    onChange={(e) => setIsTermsAgreed(e.target.checked)}
                    className="h-4 w-4 text-[#e11d48] focus:ring-[#fda4af]"
                  />
                  <label className="ml-2 text-gray-600">
                    Ik ga akkoord met de <a href="#" className="text-[#e11d48]" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms and Conditions</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#f43f5e] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-105"
                  disabled={!isTermsAgreed || signUpPassword !== confirmPassword || !facilityCode}
                >
                  Registreer
                </button>
              </form>
            )}

            <div className="text-center mt-8">
              {isLogin ? (
                <p className="text-gray-600">
                  Hebt u nog geen account?{' '}
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
                  Hebt u al een account?{' '}
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

        {showTermsModal && (
          <div className="fixed inset-0 bg-[#881337] bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-[#be123c]">Algemene Voorwaarden</h2>
              <div className="mb-6 overflow-y-scroll h-64 p-4 border rounded-lg">
                <p className="text-gray-600">
                  Welkom op ons platform. Door onze diensten te gebruiken, stemt u ermee in zich te houden aan de volgende voorwaarden:
                  <br /><br />
                  1. <strong>Aanvaarding van de Voorwaarden:</strong> Door een account aan te maken, gaat u akkoord met deze voorwaarden en eventuele wijzigingen.
                  <br /><br />
                  2. <strong>Privacybeleid:</strong> Uw persoonlijke gegevens worden beschermd volgens ons privacybeleid.
                  <br /><br />
                  3. <strong>Accountverantwoordelijkheden:</strong> U zowel als de begeleider die u toegewezen werd, zijn verantwoordelijk voor het bewaren van de vertrouwelijkheid van uw account.
                  <br /><br />
                  4. <strong>Verboden Activiteiten:</strong> U mag zich niet bezighouden met illegale of schadelijke activiteiten op dit platform.
                  <br /><br />
                  5. <strong>Beëindiging:</strong> Wij behouden ons het recht voor om uw account op elk moment te schorsen of te beëindigen.
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
                Sluit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;