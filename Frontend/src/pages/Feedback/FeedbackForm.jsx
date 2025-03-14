import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
    
    try {
      await axios.post('http://127.0.0.1:8000/api/feedback/', formData);
      
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: 'Feedback submitted successfully!' }
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setStatus({ submitted: false, submitting: false, info: { error: false, msg: null } });
      }, 5000);
      
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: 'An error occurred. Please try again later.' }
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">We Value Your Feedback</h2>
      <p className="text-gray-600 mb-4">Your feedback helps us improve our services.</p>
      
      {status.info.msg && (
        <div className={`text-white p-2 mb-4 rounded ${status.info.error ? 'bg-red-500' : 'bg-green-500'}`}>
          {status.info.msg}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row w-full gap-4">
        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="p-2 border rounded-lg w-full"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="p-2 border rounded-lg w-full"
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Feedback Subject"
            required
            className="p-2 border rounded-lg w-full"
          />
        </div>
        <div className="flex flex-col w-full lg:w-2/3">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Feedback Message"
            rows="4"
            required
            className="p-2 border rounded-lg w-full"
          ></textarea>
          <button 
            type="submit" 
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
            disabled={status.submitting}
          >
            {status.submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
