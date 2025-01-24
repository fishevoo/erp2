import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import logo from './images/logo.png';
import userAvatar from './images/user-avatar.png';
import Login from './Login';
import { getData } from './services/api';
import MTOList from './components/MTOList';

function App() {
  const [currentUser] = useState('Duta Alamin');
  const [activePage, setActivePage] = useState('dashboard');
  const [menuState, setMenuState] = useState({
    showInputMenu: false,
    expandedCategory: null
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [data, setData] = useState([]);
  
  const inputMenuItems = {
    'HRD': [
      'Cuti Karyawan',
      'Keterlambatan & Ijin',
      'Cuti Potong Gaji',
      'Recruitment'
    ],
    'PROCUREMENT': [
    'PO'],
    'LOGISTIC': [
    'Consumable RAIR',
    'LOGISTIC RAIR'],
    'ENGINEERING': [
      'Raw Material MTO',
      'Raw Material PR',
      'Consumable PR',
      'Consumable RAIR',
      'Expense Statement',
      'RAIR Surplus',
      'Convert NC to NC1',
      'Cuti Karyawan',
      'Surat Perintah Jalan'
    ]
  };

  const profileMenuItems = [
    { icon: 'fas fa-user', label: 'View Profile' },
    { icon: 'fas fa-calendar-alt', label: 'Cuti Pribadi' },
    { icon: 'fas fa-notes-medical', label: 'Riwayat Pengobatan' },
    { icon: 'fas fa-key', label: 'Ganti Password' },
    { icon: 'fas fa-sign-out-alt', label: 'Sign out' }
  ];

  const handleInputMenuToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(prev => ({
      ...prev,
      showInputMenu: !prev.showInputMenu
    }));
  };

  const handleInputMenuClick = (event, menuItem) => {
    event.preventDefault();
    event.stopPropagation();
    
    const formattedPage = menuItem.toLowerCase().replace(/\s+/g, '-');
    setActivePage(formattedPage);
    
    setMenuState({
      showInputMenu: false,
      expandedCategory: null
    });
  };

  const toggleCategory = (event, category) => {
    event.preventDefault();
    event.stopPropagation();
    
    setMenuState(prev => ({
      ...prev,
      expandedCategory: prev.expandedCategory === category ? null : category
    }));
  };

  const handleSignOut = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      setActivePage('dashboard');
      setMenuState({
        showInputMenu: false,
        expandedCategory: null
      });
      setShowProfileMenu(false);
      
      window.location.href = '/login';
    }
  };

  const handleProfileMenuClick = (label) => {
    if (label === 'Sign out') {
      handleSignOut();
      return;
    }
    const page = label.toLowerCase().replace(/\s+/g, '-');
    setActivePage(page);
    setShowProfileMenu(false);
  };

  const handleLogoClick = () => {
    setActivePage('dashboard');
    setMenuState({
      showInputMenu: false,
      expandedCategory: null
    });
    setShowProfileMenu(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    switch(activePage) {
      case 'view-profile':
        return (
          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-cover">
                <div className="profile-avatar">
                  <img src={userAvatar} alt="User avatar" />
                </div>
              </div>
              <div className="profile-body">
                <h2 className="profile-name">{currentUser}</h2>
                <p className="profile-title">Staff IT</p>
                <p className="profile-department">Information Technology Department</p>
                
                <div className="profile-info-grid">
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-id-card"></i>
                      NIK
                    </div>
                    <div className="info-value">2024001</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-briefcase"></i>
                      Position
                    </div>
                    <div className="info-value">
                      <span className="status-badge">IT Staff</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-calendar-alt"></i>
                      Tanggal Bergabung
                    </div>
                    <div className="info-value">01 Januari 2024</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-envelope"></i>
                      Email
                    </div>
                    <div className="info-value">duta.alamin@kbi.co.id</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-phone"></i>
                      No. Telepon
                    </div>
                    <div className="info-value">081234567890</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-map-marker-alt"></i>
                      Alamat
                    </div>
                    <div className="info-value">
                      Jl. Raya Bekasi KM.27 Medan Satria, Bekasi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'cuti-pribadi':
        return (
          <div className="leave-history">
            <h2>Riwayat Cuti</h2>
            </div>
        );

      case 'riwayat-pengobatan':
        return (
          <div className="medical-history">
            <h2>Riwayat Pengobatan</h2>
            <div className="history-card">
              <div className="history-header">
                <div className="history-date">-</div>
                <div className="history-status status-approved">-</div>
              </div>
              <div className="history-details">
                <div className="detail-item">
                  <div className="detail-label">Jenis Pengobatan</div>
                  <div className="detail-value">-</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Rumah Sakit</div>
                  <div className="detail-value">-</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Dokter</div>
                  <div className="detail-value">-</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Diagnosa</div>
                  <div className="detail-value">-</div>
                </div>
              </div>
            </div>
            
            <div className="history-card">
              <div className="history-header">
                <div className="history-date">-</div>
                <div className="history-status status-approved">-</div>
              </div>
              <div className="history-details">
                <div className="detail-item">
                  <div className="detail-label">Jenis Pengobatan</div>
                  <div className="detail-value">-</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Rumah Sakit</div>
                  <div className="detail-value">-</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Dokter</div>
                  <div className="detail-value">-</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Diagnosa</div>
                  <div className="detail-value">-</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ganti-password':
        return (
          <div className="change-password">
            <h2>Ganti Password</h2>
            <form className="password-form">
              <div className="form-group">
                <label>Password Lama</label>
                <input type="password" placeholder="Masukkan password lama" />
              </div>
              <div className="form-group">
                <label>Password Baru</label>
                <input type="password" placeholder="Masukkan password baru" />
              </div>
              <div className="form-group">
                <label>Konfirmasi Password Baru</label>
                <input type="password" placeholder="Konfirmasi password baru" />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">Simpan Password</button>
              </div>
            </form>
          </div>
        );

      case 'input-data':
        return (
          <div className="data-input-container">
            <h2>INPUT DATA</h2>
            <form className="data-input-form">
              <div className="form-group">
                <label>Nama Proyek</label>
                <input type="text" placeholder="Masukkan nama proyek" />
              </div>
              
              <div className="form-group">
                <label>Lokasi</label>
                <input type="text" placeholder="Masukkan lokasi proyek" />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal Mulai</label>
                  <input type="date" />
                </div>
                
                <div className="form-group">
                  <label>Tanggal Selesai</label>
                  <input type="date" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Anggaran</label>
                <input type="number" placeholder="Masukkan anggaran proyek" />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select>
                  <option value="">Pilih status</option>
                  <option value="planning">Perencanaan</option>
                  <option value="ongoing">Sedang Berjalan</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea placeholder="Masukkan deskripsi proyek"></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-submit">Simpan Data</button>
                <button type="reset" className="btn-reset">Reset</button>
              </div>
            </form>
          </div>
        );

      case 'raw-material-pr':
        return (
          <div className="pr-list-container">
            <div className="pr-header">
              <h2>Daftar PR Raw Material</h2>
              <div className="pr-controls">
                <div className="search-box">
                  <label>No. PR:</label>
                  <input type="text" placeholder="Pencarian..." />
                </div>
                <div className="date-range">
                  <label>Periode:</label>
                  <input type="date" defaultValue="2025-01-01" />
                  <input type="date" defaultValue="2025-01-31" />
                </div>
                <div className="action-buttons">
                  <button className="btn-print"><i className="fas fa-print"></i> Print</button>
                  <button className="btn-preview"><i className="fas fa-eye"></i> Preview</button>
                  <button className="btn-add"><i className="fas fa-plus"></i> Add New</button>
                  <button className="btn-delete"><i className="fas fa-trash"></i> Delete</button>
                  <button className="btn-refresh"><i className="fas fa-sync"></i> Refresh</button>
                </div>
              </div>
            </div>
            <div className="pr-table-container">
              <table className="pr-table">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>NOMOR</th>
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

      case 'raw-material-mto':
        return (
          <div className="pr-list-container">
            <div className="pr-header">
              <h2>Daftar MTO Raw Material</h2>
              <MTOList />
            </div>
          </div>
        );

      case 'consumable-pr':
        return (
          <div className="pr-list-container">
            <div className="pr-header">
              <h2>Daftar PR Consumable</h2>
              <div className="pr-controls">
                <div className="search-box">
                  <label>No. PR:</label>
                  <input type="text" placeholder="Pencarian..." />
                </div>
                <div className="date-range">
                  <label>Periode:</label>
                  <input type="date" defaultValue="2025-01-01" />
                  <input type="date" defaultValue="2025-01-31" />
                </div>
                <div className="action-buttons">
                  <button className="btn-print"><i className="fas fa-print"></i> Print</button>
                  <button className="btn-preview"><i className="fas fa-eye"></i> Preview</button>
                  <button className="btn-add"><i className="fas fa-plus"></i> Add New</button>
                  <button className="btn-delete"><i className="fas fa-trash"></i> Delete</button>
                  <button className="btn-refresh"><i className="fas fa-sync"></i> Refresh</button>
                </div>
              </div>
            </div>
            <div className="pr-table-container">
              <table className="pr-table">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>NOMOR</th>
                    <th>TANGGAL</th>
                    <th>DEPARTEMEN</th>
                    <th>KETERANGAN</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
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
          </div>
        );

      case 'consumable-rair':
        return (
          <div className="pr-list-container">
            <div className="pr-header">
              <h2>Daftar RAIR Consumable</h2>
              <div className="pr-controls">
                <div className="search-box">
                  <label>No. RAIR:</label>
                  <input type="text" placeholder="Pencarian..." />
                </div>
                <div className="date-range">
                  <label>Periode:</label>
                  <input type="date" defaultValue="2025-01-01" />
                  <input type="date" defaultValue="2025-01-31" />
                </div>
                <div className="action-buttons">
                  <button className="btn-print"><i className="fas fa-print"></i> Print</button>
                  <button className="btn-preview"><i className="fas fa-eye"></i> Preview</button>
                  <button className="btn-add"><i className="fas fa-plus"></i> Add New</button>
                  <button className="btn-delete"><i className="fas fa-trash"></i> Delete</button>
                  <button className="btn-refresh"><i className="fas fa-sync"></i> Refresh</button>
                </div>
              </div>
            </div>
            <div className="pr-table-container">
              <table className="pr-table">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>NOMOR RAIR</th>
                    <th>TANGGAL</th>
                    <th>DEPARTEMEN</th>
                    <th>KETERANGAN</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
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
          </div>
        );

      default:
        return (
          <div className="welcome-section">
            <h2>Enterprise Resource Planning</h2>
            <h3>PT Karunia Berca Indonesia</h3>
          </div>
        );
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <div className="App">
              <nav className="navbar">
                <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                  <img src={logo} alt="Company Logo" />
                  <h1>PT KARUNIA BERCA INDONESIA</h1>
                </div>
                <div className="nav-icons">
                  <button className="icon-button">
                    <i className="fas fa-th-large"></i>
                  </button>
                  <button className="icon-button">
                    <i className="fas fa-chart-bar"></i>
                  </button>
                  <button className="icon-button">
                    <i className="fas fa-calendar"></i>
                  </button>
                  <div className="user-profile-dropdown">
                    <div 
                      className="user-profile"
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                      <img src={userAvatar} alt="User avatar" />
                      <span>{currentUser}</span>
                      <i className={`fas fa-chevron-${showProfileMenu ? 'up' : 'down'} profile-arrow`}></i>
                    </div>
                    {showProfileMenu && (
                      <div className="profile-menu">
                        {profileMenuItems.map((item, index) => (
                          <div 
                            key={index} 
                            className="profile-menu-item"
                            onClick={() => handleProfileMenuClick(item.label)}
                          >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              <div className="main-container">
                <aside className="sidebar">
                  <div 
                    className={`menu-item ${activePage === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActivePage('dashboard')}
                  >
                    <i className="fas fa-home"></i>
                    <span>Dashboard</span>
                  </div>
                  
                  <div className="menu-item-dropdown">
                    <div 
                      className={`menu-item ${menuState.showInputMenu ? 'active' : ''}`}
                      onClick={handleInputMenuToggle}
                    >
                      <i className="fas fa-database"></i>
                      <span>Input Data</span>
                      <i className={`fas fa-chevron-${menuState.showInputMenu ? 'up' : 'down'} menu-arrow`}></i>
                    </div>
                    
                    {menuState.showInputMenu && (
                      <div className="submenu">
                        {Object.entries(inputMenuItems).map(([category, items]) => (
                          <div key={category} className="submenu-category">
                            <div 
                              className="submenu-header"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleCategory(e, category);
                              }}
                            >
                              <span>{category}</span>
                              {items.length > 0 && (
                                <i className={`fas fa-chevron-${menuState.expandedCategory === category ? 'down' : 'right'}`}></i>
                              )}
                            </div>
                            {items.length > 0 && menuState.expandedCategory === category && (
                              <div 
                                className={`submenu-items ${menuState.expandedCategory === category ? 'expanded' : ''}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {items.map(item => (
                                  <div 
                                    key={item} 
                                    className="submenu-item"
                                    onClick={(e) => handleInputMenuClick(e, item)}
                                  >
                                    {item}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </aside>

                <main className="content">
                  {renderContent()}
                </main>
              </div>
            </div>
          } 
        />
        <Route path="/mto" element={<MTOList />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
