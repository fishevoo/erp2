import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const MTOList = () => {
  const [data, setData] = useState([]);
  const [, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [searchTerm, setSearchTerm] = useState('');

  // Fungsi untuk mengambil data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5002/api/mto');
      setData(response.data);
    } catch (error) {
      message.error('Gagal mengambil data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data saat komponen dimount
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk print preview
  const handlePrintPreview = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5004/api/mto/${id}/preview`);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Preview - MTO ${response.data.NOMOR}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>MTO Raw Material</h1>
              <h2>${response.data.NOMOR}</h2>
            </div>
            <div class="content">
              <p><strong>Tanggal:</strong> ${response.data.TANGGAL_FORMATTED}</p>
              <p><strong>JO:</strong> ${response.data.JO}</p>
              <p><strong>Project:</strong> ${response.data.PROJECT}</p>
              <p><strong>Status:</strong> ${response.data.STATUS}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      message.error('Gagal membuka print preview: ' + error.message);
    }
  };

  // Fungsi untuk menambah data baru
  const handleAdd = async () => {
    // Implementasi Add New
    message.info('Fitur Add New akan segera tersedia');
  };

  // Fungsi untuk menghapus data
  const handleDelete = async () => {
    // Implementasi Delete
    message.info('Fitur Delete akan segera tersedia');
  };

  return (
    <div>
      <div className="pr-controls">
        <div className="search-box">
          <label>No. MTO:</label>
          <input 
            type="text" 
            placeholder="Pencarian..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="date-range">
          <label>Periode:</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          <button className="btn-print" onClick={() => handlePrintPreview()}>
            <i className="fas fa-print"></i> Print
          </button>
          <button className="btn-preview" onClick={() => handlePrintPreview()}>
            <i className="fas fa-eye"></i> Preview
          </button>
          <button className="btn-add" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Add New
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            <i className="fas fa-trash"></i> Delete
          </button>
          <button className="btn-refresh" onClick={fetchData}>
            <i className="fas fa-sync"></i> Refresh
          </button>
        </div>
      </div>
      <div className="pr-table-container">
        <table className="pr-table">
          <thead>
            <tr>
              <th>NO.</th>
              <th>NOMOR MTO</th>
              <th>JO</th>
              <th>TANGGAL</th>
              <th>PROJECT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.NO}</td>
                <td>{item.NOMOR}</td>
                <td>{item.JO}</td>
                <td>{item.TANGGAL}</td>
                <td>{item.PROJECT}</td>
                <td>{item.STATUS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MTOList; 
