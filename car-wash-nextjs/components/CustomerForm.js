import { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_phone: ''
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(null);
  const SUBMISSION_COOLDOWN = 30000; // 30 seconds between submissions
  const SESSION_TIMEOUT = 300000; // 5 minutes
  const [sessionTimer, setSessionTimer] = useState(null);

  // Format name to proper case
  const formatName = (input) => {
    if (!input) return '';
    return input
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format phone number for display
  const formatPhoneForDisplay = (input) => {
    // Strip all non-digits
    const digits = input.replace(/\D/g, '');
    
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0,3)})-${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0,3)})-${digits.slice(3,6)}-${digits.slice(6,10)}`;
    }
  };

  // Format phone number for API submission
  const formatPhoneForSubmission = (input) => {
    const digits = input.replace(/\D/g, '');
    return digits.length === 10 ? `+1${digits}` : '';
  };

  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'mobile_phone') {
      // Only allow digits and format them
      const formattedValue = formatPhoneForDisplay(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'first_name' || name === 'last_name') {
      // Format names in proper case
      const formattedValue = formatName(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if enough time has passed since last submission
    if (lastSubmissionTime && Date.now() - lastSubmissionTime < SUBMISSION_COOLDOWN) {
      setError('Please wait a moment before trying again.');
      return;
    }

    setError(null);
    setResponse(null);
    setIsExistingUser(false);
    
    // Validate inputs
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!validatePhone(formData.mobile_phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!consent) {
      setError('Please check the box to agree to receive communications and continue.');
      return;
    }

    try {
      setLastSubmissionTime(Date.now());
      setLoading(true);
      const result = await axios.post(
        '/api/submit-form',
        {
          first_name: formatName(formData.first_name),
          last_name: formatName(formData.last_name),
          mobile_phone: formatPhoneForSubmission(formData.mobile_phone)
        }
      );
      
      if (result.data.code) {
        setResponse(result.data.message);
      } else {
        setIsExistingUser(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset session timer on any user activity
  const resetSessionTimer = () => {
    if (sessionTimer) clearTimeout(sessionTimer);
    const newTimer = setTimeout(() => {
      setFormData({
        first_name: '',
        last_name: '',
        mobile_phone: ''
      });
      setConsent(false);
      setError('Session expired. Please try again.');
    }, SESSION_TIMEOUT);
    setSessionTimer(newTimer);
  };

  // Add cleanup
  useEffect(() => {
    return () => {
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, [sessionTimer]);

  // Add event listeners for user activity
  useEffect(() => {
    const handleActivity = () => resetSessionTimer();
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keypress', handleActivity);

    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keypress', handleActivity);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            {response || isExistingUser ? (
              <>
                <div className="flex justify-center mb-6">
                  <img 
                    src="https://tntcloudblob.blob.core.windows.net/logos/TnT%2075%20200x200%20Circle.png" 
                    alt="Toot'n Totum" 
                    className="w-[200px] h-auto"
                  />
                </div>
                <div className={`text-center py-4 px-6 ${
                  response 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50' 
                    : 'bg-gradient-to-r from-rose-50 to-red-50'
                } rounded-lg shadow-sm`}>
                  {response ? (
                    <>
                      <div className="text-2xl mb-2">🎉 Congratulations! 🎉</div>
                      <div className="text-lg font-medium text-emerald-600 mb-2">
                        Your free car wash code is on its way!
                      </div>
                      <div className="text-md text-emerald-700 p-3 bg-white rounded-md shadow-sm">
                        Check your text messages for your unique code. Show this code to the car wash attendant at any of our 10 locations to enjoy your free wash!
                      </div>
                      <div className="text-sm text-emerald-600 mt-4">
                        Haven't received your code? Please allow a few minutes for delivery.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl mb-2">👋 Welcome Back! 👋</div>
                      <div className="text-lg font-medium text-rose-600 mb-3">
                        It looks like you've already received a free wash code within the last 6 months.
                      </div>
                      <div className="text-md text-rose-700 p-3 bg-white rounded-md shadow-sm">
                        We hope you enjoyed your free wash. Visit us for a wash anytime – we'd love to see you again!
                      </div>
                      <div className="text-sm text-rose-600 mt-2">
                        Thank you for being a valued customer!
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <img 
                    src="https://tntcloudblob.blob.core.windows.net/logos/Express%20Car%20Wash.png" 
                    alt="Toot'n Totum Express Wash" 
                    className="w-[200px] h-auto"
                  />
                </div>
                <div className="text-center mb-4">
                  <div className="inline-block">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-3">
                      Discover Toot'n Totum Express Wash
                    </h1>
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">
                    Enter your name and mobile number below, and we'll send you a code for a complimentary car wash at any of our locations.
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                        <input
                          type="tel"
                          name="mobile_phone"
                          value={formData.mobile_phone}
                          onChange={handleChange}
                          placeholder="(XXX)-XXX-XXXX"
                          maxLength="14"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                      </div>

                      <div className="flex items-start space-x-2 mt-4">
                        <input
                          type="checkbox"
                          id="consent"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="mt-1"
                        />
                        <label htmlFor="consent" className="text-sm text-gray-600">
                          I agree to receive marketing communications and SMS messages. By submitting this form, 
                          I consent to receive promotional offers and updates. Message and data rates may apply. 
                          Message frequency varies. Reply HELP for help or STOP to cancel at any time.
                        </label>
                      </div>

                      {error && (
                        <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 rounded-md">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Processing...' : 'Get My Free Wash Code'}
                      </button>
                      
                      <p className="text-center text-sm text-gray-500 mt-2">
                        You'll receive your code via SMS within 1 minute!
                      </p>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
