import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const getEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axios.post(`${API_URL}/events`, eventData);
  return response.data;
};

export const updateEvent = async (eventId, updatedEvent) => {
  const response = await axios.put(`${API_URL}/events/${eventId}`, updatedEvent);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await axios.delete(`${API_URL}/events/${eventId}`);
  return response.data;
};

export const registerForEvent = async (registrationData) => {
  const response = await axios.post(`${API_URL}/register`, registrationData);
  return response.data;
};
