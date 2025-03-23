import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const useEventApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = {
    list: async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('categories', filters.category);
        if (filters.search) params.append('search', filters.search);

        const url = filters.club
          ? `${API_BASE_URL}/clubs/${filters.club}/events/`
          : `${API_BASE_URL}/events/?${params.toString()}`;

        const response = await axios.get(url);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch events');
        throw error;
      } finally {
        setLoading(false);
      }
    },

    create: async (eventData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/events/create/`, eventData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create event');
      }
    },

    update: async (id, eventData) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/events/${id}/update/`, eventData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update event');
      }
    },

    delete: async (id) => {
      try {
        await axios.delete(`${API_BASE_URL}/events/${id}/delete/`);
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete event');
      }
    },

    getDetails: async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events/${id}/`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch event details');
      }
    }
  };

  return { api, loading, error };
};