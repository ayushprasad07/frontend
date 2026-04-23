// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw, 
  Filter,
  Package,
  Tag,
  MapPin,
  Calendar,
  Phone,
  AlertCircle,
  CheckCircle,
  Check,
  LogOut
} from 'lucide-react';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    itemName: '',
    Description: '',
    type: '',
    Location: '',
    date: '',
    contactInfo: ''
  });

  const token = localStorage.getItem('token');
  const API_URL = 'https://lost-found-uapb.onrender.com/api/item';
  const AUTH_URL = 'https://lost-found-uapb.onrender.com/api/auth';
  const navigate = useNavigate();

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
        setFilteredItems(data.items);
      }
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'GET',
        credentials: 'include'
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const searchItems = async (query) => {
    if (!query.trim()) {
      filterItemsByType(typeFilter);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/search?itemName=${query}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setFilteredItems([data.data]);
      } else {
        setFilteredItems([]);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const createItem = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Item created successfully!');
        fetchItems();
        handleCloseModal();
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to create item');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Failed to create item');
      setTimeout(() => setError(null), 3000);
    }
  };

  const updateItem = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Item updated successfully!');
        fetchItems();
        handleCloseModal();
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to update item');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Failed to update item');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setSuccess('Item deleted successfully!');
          fetchItems();
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError(data.message || 'Failed to delete item');
          setTimeout(() => setError(null), 3000);
        }
      } catch (err) {
        setError('Failed to delete item');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const filterItemsByType = (type) => {
    if (type === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.type === type));
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      searchItems(value);
    } else {
      filterItemsByType(typeFilter);
    }
  };

  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
    if (searchTerm.trim()) {
      searchItems(searchTerm);
    } else {
      filterItemsByType(type);
    }
  };

  const handleOpenModal = (mode, item = null) => {
    setModalMode(mode);
    if (mode === 'edit' && item) {
      setSelectedItem(item);
      setFormData({
        itemName: item.itemName,
        Description: item.Description,
        type: item.type,
        Location: item.Location,
        date: item.date ? item.date.split('T')[0] : '',
        contactInfo: item.contactInfo
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      Description: '',
      type: '',
      Location: '',
      date: '',
      contactInfo: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      createItem();
    } else {
      updateItem();
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const uniqueTypes = ['all', 'Lost', 'Found'];

  const getTypeBadgeClass = (type) => {
    return type === 'Lost' ? 'bg-danger' : 'bg-success';
  };

  const getTypeIcon = (type) => {
    return type === 'Lost' ? <AlertCircle size={14} /> : <CheckCircle size={14} />;
  };

  // Calculate statistics
  const lostItemsCount = items.filter(item => item.type === 'Lost').length;
  const foundItemsCount = items.filter(item => item.type === 'Found').length;
  const uniqueLocations = new Set(items.map(i => i.Location)).size;

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        {/* Header Section */}
        <div className="bg-white rounded-4 shadow-sm p-4 mb-4 animate__fadeIn">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="display-5 fw-bold text-primary mb-2">Lost & Found Dashboard</h1>
              <p className="text-muted lead">Track lost and found items efficiently</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm"
                onClick={() => handleOpenModal('create')}
              >
                <Plus size={20} className="me-2" /> Report Item
              </button>
              <button 
                className="btn btn-outline-danger btn-lg rounded-pill px-4 shadow-sm"
                onClick={handleLogout}
              >
                <LogOut size={20} className="me-2" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm animate__slideDown" role="alert">
            <Check size={18} className="me-2" />
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
          </div>
        )}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show rounded-3 shadow-sm animate__slideDown" role="alert">
            <X size={18} className="me-2" />
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Statistics Section - Top */}
        <div className="row mb-4 animate__fadeInUp">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-4 text-center h-100">
              <div className="card-body">
                <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <Package size={28} className="text-primary" />
                </div>
                <h2 className="fw-bold text-primary mb-0">{items.length}</h2>
                <p className="text-muted mb-0">Total Items</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-4 text-center h-100">
              <div className="card-body">
                <div className="bg-danger bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <AlertCircle size={28} className="text-danger" />
                </div>
                <h2 className="fw-bold text-danger mb-0">{lostItemsCount}</h2>
                <p className="text-muted mb-0">Lost Items</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-4 text-center h-100">
              <div className="card-body">
                <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <CheckCircle size={28} className="text-success" />
                </div>
                <h2 className="fw-bold text-success mb-0">{foundItemsCount}</h2>
                <p className="text-muted mb-0">Found Items</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-4 text-center h-100">
              <div className="card-body">
                <div className="bg-info bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <MapPin size={28} className="text-info" />
                </div>
                <h2 className="fw-bold text-info mb-0">{uniqueLocations}</h2>
                <p className="text-muted mb-0">Locations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="row mb-4 animate__fadeInUp">
          <div className="col-md-8 mb-3 mb-md-0">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search items by name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    filterItemsByType(typeFilter);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white">
                <Filter size={18} className="text-primary" />
              </span>
              <select 
                className="form-select bg-white"
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
              >
                <option value="all">All Items</option>
                <option value="Lost">Lost Items</option>
                <option value="Found">Found Items</option>
              </select>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mb-3">
          <button 
            className="btn btn-outline-primary rounded-pill btn-sm"
            onClick={fetchItems}
          >
            <RefreshCw size={14} className={`me-2 ${loading ? 'fa-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Items Table Section */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden animate__fadeInUp">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading items...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-5">
                <Package size={64} className="text-muted mb-3" />
                <h4 className="text-muted">No items found</h4>
                <p className="text-muted">Click "Report Item" to create your first entry</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-primary bg-opacity-10">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3">Item Name</th>
                      <th className="py-3">Description</th>
                      <th className="py-3">Type</th>
                      <th className="py-3">Location</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Contact</th>
                      <th className="py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={item._id}>
                        <td className="px-4 fw-semibold text-primary">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="fw-semibold">{item.itemName}</td>
                        <td className="text-muted" style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.Description}
                        </td>
                        <td>
                          <span className={`badge ${getTypeBadgeClass(item.type)} px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1`}>
                            {getTypeIcon(item.type)}
                            {item.type}
                          </span>
                        </td>
                        <td>
                          <MapPin size={14} className="text-primary me-1" />
                          {item.Location}
                        </td>
                        <td>
                          <Calendar size={14} className="text-primary me-1" />
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td>
                          <Phone size={14} className="text-primary me-1" />
                          {item.contactInfo}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-primary btn-sm me-2 rounded-circle"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            onClick={() => handleOpenModal('edit', item)}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm rounded-circle"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            onClick={() => deleteItem(item._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredItems.length > 0 && (
              <div className="d-flex justify-content-end p-3 bg-light">
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(1)}>First</button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage - 1)}>Prev</button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => paginate(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(totalPages)}>Last</button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-primary bg-opacity-10 border-0 rounded-top-4">
                <h5 className="modal-title fw-bold text-primary">
                  {modalMode === 'create' ? (
                    <>
                      <Plus size={20} className="me-2" /> Report New Item
                    </>
                  ) : (
                    <>
                      <Edit size={20} className="me-2" /> Edit Item Details
                    </>
                  )}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Item Name *</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        placeholder="Enter item name"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Item Type *</label>
                      <select
                        className="form-select rounded-3"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description *</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="3"
                      name="Description"
                      value={formData.Description}
                      onChange={handleInputChange}
                      placeholder="Describe the item in detail"
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Location *</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        name="Location"
                        value={formData.Location}
                        onChange={handleInputChange}
                        placeholder="Where was it lost/found?"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Date *</label>
                      <input
                        type="date"
                        className="form-control rounded-3"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Contact Info *</label>
                    <input
                      type="number"
                      className="form-control rounded-3"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      placeholder="Phone number for contact"
                      required
                    />
                    <small className="text-muted">Your phone number will be used for contact purposes</small>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 rounded-bottom-4">
                  <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">
                    {modalMode === 'create' ? 'Report Item' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate__fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate__fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate__slideDown {
          animation: slideDown 0.4s ease-out;
        }
        .btn-outline-primary.btn-sm.rounded-circle:hover,
        .btn-outline-danger.btn-sm.rounded-circle:hover {
          transform: scale(1.1);
        }
        .btn-outline-primary.btn-sm.rounded-circle,
        .btn-outline-danger.btn-sm.rounded-circle {
          transition: transform 0.2s ease;
        }
        .card {
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .table tbody tr {
          transition: background-color 0.2s ease;
        }
        .btn-primary {
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;