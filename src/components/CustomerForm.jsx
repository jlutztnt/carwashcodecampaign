import { useState } from 'react';
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
    setError(null);
    setResponse(null);
    
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
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post(
        'https://prod-181.westus.logic.azure.com:443/workflows/106f4f646ca7411aa86f9f099086eaeb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fy8Sgl8WwG9bVqjUOXEKUVQ1NC_g6bWG1V_xlDbWvB4',
        {
          first_name: formData.first_name.toUpperCase(),
          last_name: formData.last_name.toUpperCase(),
          mobile_phone: formatPhoneForSubmission(formData.mobile_phone)
        },
        {
          headers: {
            'Auth': 'eW91clN0cmluZw=='
          }
        }
      );
      
      // Handle the response based on the code value
      if (result.data.code) {
        setResponse(result.data.message);
      } else {
        setError('Only one code can be requested every six months.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <img 
                src="https://tntcloudblob.blob.core.windows.net/logos/Express%20Car%20Wash.png" 
                alt="Toot'n Totum Express Wash" 
                className="w-[200px] h-auto"
              />
            </div>

            <div className="text-center mb-8">
              <div className="inline-block">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-3">
                  First Wash on Us!
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></div>
              </div>
              <h2 className="text-xl text-gray-600 mt-4 font-medium">
                Discover 
                <span className="text-indigo-600 font-semibold"> Toot'n Totum </span>
                Express Wash
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {response ? (
                <div className="text-center py-4 px-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm">
                  <div className="text-2xl mb-2">🎉 Congratulations! 🎉</div>
                  <div className="text-lg font-medium text-emerald-600 mb-2">
                    Here's your special code:
                  </div>
                  <div className="text-xl font-bold text-emerald-700 p-3 bg-white rounded-md shadow-sm">
                    {response}
                  </div>
                  <div className="text-sm text-emerald-600 mt-2">
                    Thank you for participating!
                  </div>
                </div>
              ) : (
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
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm; 