import axios from 'axios';

// const API_URL = 'http://localhost:8000';
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export default API;
// Signup
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Signup failed';
  }
};

// Login
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Login failed';
  }
};

// Get All Events
export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to fetch events';
  }
};

// Create Event (Admin)
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/events`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to create event';
  }
};

// Update Event (Admin)
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(`${API_URL}/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to update event';
  }
};

// Delete Event (Admin)
export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to delete event';
  }
};

// Register for Event (Student)
export const registerForEvent = async (registrationData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, registrationData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to register';
  }
};
