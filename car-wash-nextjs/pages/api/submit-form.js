import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { first_name, last_name, mobile_phone } = req.body;

    // Default API endpoint if environment variable is not set
    const apiEndpoint = process.env.API_ENDPOINT || 
      'https://prod-181.westus.logic.azure.com:443/workflows/106f4f646ca7411aa86f9f099086eaeb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fy8Sgl8WwG9bVqjUOXEKUVQ1NC_g6bWG1V_xlDbWvB4';

    // Call the external API
    const result = await axios.post(
      apiEndpoint,
      {
        first_name,
        last_name,
        mobile_phone
      },
      {
        headers: {
          'Auth': process.env.API_AUTH_TOKEN || 'eW91clN0cmluZw=='
        }
      }
    );

    // Return the response from the external API
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    return res.status(500).json({ 
      message: error.response?.data?.message || 'An error occurred. Please try again.'
    });
  }
}
