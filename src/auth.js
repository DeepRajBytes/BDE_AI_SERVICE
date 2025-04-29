const API_URL = 'http://158.220.115.133:3001/api';

const storeResponse = (endpoint, responseData) => {
  try {
    const existingResponses = localStorage.getItem('apiResponses');
    const responses = existingResponses ? JSON.parse(existingResponses) : {};

    if (!responses[endpoint]) {
      responses[endpoint] = [];
    }

    responses[endpoint].push({
      data: responseData,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem('apiResponses', JSON.stringify(responses));
  } catch (error) {
    console.error('Error storing API response:', error);
  }
};

export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    storeResponse('signup', data); // data is already an object

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    if (!data.token) {
      throw new Error('No token received from server');
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const responseData = await response.json();

    // Store the complete response
    storeResponse('login', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Login failed');
    }

    // Check if token exists in the nested data structure
    if (responseData.data?.token) {
      return {
        token: responseData.data.token,
        fullResponse: responseData
      };
    } else {
      throw new Error('Token not found in response');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getStoredResponses = () => {
  return JSON.parse(localStorage.getItem('apiResponses')) || {};
};

export const storeToken = (token) => {
  localStorage.setItem('jwtToken', token);
};

export const getToken = () => {
  return localStorage.getItem('jwtToken');
};

export const removeToken = () => {
  localStorage.removeItem('jwtToken');
};
