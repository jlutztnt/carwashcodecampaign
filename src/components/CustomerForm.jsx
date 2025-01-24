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

  const validatePhone = (phone) => {
    const phoneRegex = /^\+1\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      setError('Phone number must be in format: +1XXXXXXXXXX');
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post(
        'https://prod-181.westus.logic.azure.com:443/workflows/106f4f646ca7411aa86f9f099086eaeb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fy8Sgl8WwG9bVqjUOXEKUVQ1NC_g6bWG1V_xlDbWvB4',
        {
          first_name: formData.first_name.toUpperCase(),
          last_name: formData.last_name.toUpperCase(),
          mobile_phone: formData.mobile_phone
        },
        {
          headers: {
            'Auth': 'eW91clN0cmluZw=='
          }
        }
      );
      
      setResponse(result.data);
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
                      placeholder="+1XXXXXXXXXX"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm mt-2">
                      {error}
                    </div>
                  )}

                  {response && (
                    <div className="text-green-500 text-sm mt-2">
                      {response}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm; 