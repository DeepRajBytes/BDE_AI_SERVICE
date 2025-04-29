const API_URL = 'http://158.220.115.133:3001/api';

const storeResponse = (endpoint, responseData) => {
  try {
    const existingResponses = JSON.parse(localStorage.getItem('apiResponses') || '{}');

    const dataToStore = responseData.data?.data || responseData.data || responseData;

    if (!existingResponses[endpoint]) {
      existingResponses[endpoint] = [];
    }

    existingResponses[endpoint].push({
      data: dataToStore,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem('apiResponses', JSON.stringify(existingResponses));
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

    const responseData = await response.json();
    storeResponse('signup', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Signup failed');
    }


    const token = responseData.token ||
      responseData.data?.token ||
      responseData.data?.data?.token;

    if (!token) {
      return { success: true, userData: responseData.user || responseData };
    }

    return { token, userData: responseData.user || responseData };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};
export const validateToken = async () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Make a lightweight request to a protected endpoint
    const response = await fetch(`${API_URL}/verifyToken`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.status !== 401;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const token = data.token || data.data?.token;
    if (!token) throw new Error('No token received');

    return { token, userData: data.user || data };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getStoredResponses = () => {
  return JSON.parse(localStorage.getItem('apiResponses')) || {};
};

export const storeToken = (token, data) => {
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('userDetails', data);
};

export const getToken = () => {
  return localStorage.getItem('jwtToken');
};

export const removeToken = () => {
  localStorage.removeItem('jwtToken');
};