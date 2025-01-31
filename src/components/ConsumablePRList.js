import React, { useState, useEffect } from 'react';
import { getConsumablePRData } from '../services/api';

const ConsumablePRList = () => {
  const [prList, setPRList] = useState([]);
  const [, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchPRData = async () => {
    setLoading(true);
    try {
      const data = await getConsumablePRData();
      setPRList(data);
    } catch (error) {
      console.error('Error fetching PR data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRData();
  }, []);

  const handleFeatureNotAvailable = () => {
    alert('Mohon maaf, fitur ini sedang dalam pengembangan dan akan segera tersedia!');
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="pr-list-container">
      <div className="pr-controls">
        <div className="search-box">
          <label>No. PR:</label>
          <input type="text" placeholder="Pencarian..." />
        </div>
        <div className="date-range">
          <label>Period:</label>
          <input type="date" />
          <input type="date" />
        </div>
        <div className="action-buttons">
          <button onClick={handleFeatureNotAvailable}>
            <i className="fas fa-print"></i> Print
          </button>
          <button onClick={handleFeatureNotAvailable}>
            <i className="fas fa-eye"></i> Preview
          </button>
          <button onClick={handleFeatureNotAvailable}>
            <i className="fas fa-plus"></i> Add New
          </button>
          <button onClick={handleFeatureNotAvailable}>
            <i className="fas fa-trash"></i> Delete
          </button>
          <button onClick={handleFeatureNotAvailable}>
            <i className="fas fa-sync"></i> Refresh
          </button>
        </div>
      </div>

      <table className="pr-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>NO.</th>
            <th>NOMOR PR</th>
            <th>TANGGAL</th>
            <th>DEPARTEMEN</th>
            <th>KETERANGAN</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {prList.map((item) => (
            <tr key={item.NO}>
              <td>
                <input 
                  type="checkbox"
                  checked={selectedItems.includes(item.NO)}
                  onChange={() => handleSelectItem(item.NO)}
                />
              </td>
              <td>{item.NO}</td>
              <td>{item.NOMOR}</td>
              <td>{item.TANGGAL}</td>
              <td>{item.DEPARTEMEN}</td>
              <td>{item.KETERANGAN}</td>
              <td>{item.STATUS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsumablePRList;
