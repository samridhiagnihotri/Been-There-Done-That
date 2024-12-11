import axios from 'axios';
import { setFoods, setLoading, setError, setCategorizedFoods } from '../slices/foodSlice';

export const fetchFoods = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem('token');
    console.log('Fetching with token:', token ? 'Present' : 'Missing');
    
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/food`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Full API Response:', {
      data: response.data,
      categorizedData: response.data.categorizedData,
      sides: response.data.categorizedData?.sides
    });

    if (response.data && response.data.success) {
      dispatch(setFoods(response.data.data));
      dispatch(setCategorizedFoods(response.data.categorizedData));
    } else {
      console.error('Invalid response format:', response.data);
      dispatch(setError('Invalid data format received from server'));
    }
  } catch (error) {
    console.error('Fetch Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    dispatch(setError(error.response?.data?.message || 'Failed to fetch foods'));
  }
};

export const createFood = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/food/new`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.data.success) {
      dispatch(fetchFoods()); // Refresh the food list
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to create food item'));
    throw error;
  }
};

export const updateFood = (id, formData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/food/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.data.success) {
      dispatch(fetchFoods()); // Refresh the food list
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to update food item'));
    throw error;
  }
};

export const deleteFood = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/food/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      dispatch(fetchFoods()); // Refresh the food list
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete food item'));
    throw error;
  }
}; 