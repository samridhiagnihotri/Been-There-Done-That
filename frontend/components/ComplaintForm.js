import React, { useState } from 'react';

const ComplaintForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'low'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ subject: '', description: '', priority: 'low' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-300 mb-2">Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-700 text-white rounded-lg"
          placeholder="Enter complaint subject"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-700 text-white rounded-lg h-32"
          placeholder="Describe your complaint"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 text-white rounded-lg"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          Submit Complaint
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm; 