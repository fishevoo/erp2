const API_URL = 'http://localhost:5000/api';

export const getData = async () => {
  try {
    const response = await fetch(`${API_URL}/data`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}; 