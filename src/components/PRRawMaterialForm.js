import React, { useState } from 'react';


const PRRawMaterialForm = ({ onClose, onSuccess, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    tanggal: '',
    jo: '',
    project: '',
    department_id: 'ENG'
  });

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, formData); // Use the passed onSubmit handler
  };

  return (
    <div className="pr-form-overlay">
      <div className="pr-form">
        <h2>Add New PR Raw Material</h2>
        <form onSubmit={handleLocalSubmit}>
          <div className="form-group">
            <label>Tanggal</label>
            <input 
              type="date" 
              value={formData.tanggal}
              onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>JO Number</label>
            <input 
              type="text"
              value={formData.jo}
              onChange={(e) => setFormData({...formData, jo: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Project</label>
            <input 
              type="text"
              value={formData.project}
              onChange={(e) => setFormData({...formData, project: e.target.value})}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PRRawMaterialForm;
