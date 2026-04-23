import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit, Trash2, Search, RefreshCw, Filter,
  Package, Tag, MapPin, Calendar, Phone,
  AlertCircle, CheckCircle, Check, LogOut,
  LayoutDashboard, ListChecks, BarChart2, User
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
    itemName: '', Description: '', type: '', Location: '', date: '', contactInfo: ''
  });

  const token = localStorage.getItem('token');
  const API_URL = 'https://lost-found-uapb.onrender.com/api/item';
  const AUTH_URL = 'https://lost-found-uapb.onrender.com/api/auth';
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true); setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) { setItems(data.items); setFilteredItems(data.items); }
    } catch { setError('Failed to fetch items'); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${AUTH_URL}/logout`, { method: 'GET', credentials: 'include' });
      localStorage.removeItem('token'); navigate('/');
    } catch (err) { console.error(err); }
  };

  const searchItems = async (query) => {
    if (!query.trim()) { filterItemsByType(typeFilter); return; }
    try {
      const response = await fetch(`${API_URL}/search?itemName=${query}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      setFilteredItems(data.success ? [data.data] : []);
    } catch (err) { console.error(err); }
  };

  const createItem = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include', body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) { setSuccess('Item reported successfully!'); fetchItems(); handleCloseModal(); setTimeout(() => setSuccess(null), 3000); }
      else { setError(data.message || 'Failed to create item'); setTimeout(() => setError(null), 3000); }
    } catch { setError('Failed to create item'); setTimeout(() => setError(null), 3000); }
  };

  const updateItem = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include', body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) { setSuccess('Item updated!'); fetchItems(); handleCloseModal(); setTimeout(() => setSuccess(null), 3000); }
      else { setError(data.message || 'Update failed'); setTimeout(() => setError(null), 3000); }
    } catch { setError('Update failed'); setTimeout(() => setError(null), 3000); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) { setSuccess('Item deleted!'); fetchItems(); setTimeout(() => setSuccess(null), 3000); }
      else { setError(data.message || 'Delete failed'); setTimeout(() => setError(null), 3000); }
    } catch { setError('Delete failed'); setTimeout(() => setError(null), 3000); }
  };

  const filterItemsByType = (type) =>
    setFilteredItems(type === 'all' ? items : items.filter(i => i.type === type));

  const handleSearchChange = (e) => {
    const v = e.target.value; setSearchTerm(v);
    v.trim() ? searchItems(v) : filterItemsByType(typeFilter);
  };

  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
    searchTerm.trim() ? searchItems(searchTerm) : filterItemsByType(type);
  };

  const handleOpenModal = (mode, item = null) => {
    setModalMode(mode);
    if (mode === 'edit' && item) {
      setSelectedItem(item);
      setFormData({ itemName: item.itemName, Description: item.Description, type: item.type, Location: item.Location, date: item.date ? item.date.split('T')[0] : '', contactInfo: item.contactInfo });
    } else {
      setFormData({ itemName: '', Description: '', type: '', Location: '', date: '', contactInfo: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => { setShowModal(false); setSelectedItem(null); };
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); modalMode === 'create' ? createItem() : updateItem(); };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const lostCount = items.filter(i => i.type === 'Lost').length;
  const foundCount = items.filter(i => i.type === 'Found').length;
  const locationCount = new Set(items.map(i => i.Location)).size;

  useEffect(() => { fetchItems(); }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .sora { font-family: 'Sora', sans-serif !important; }

        /* Main */
        .main-content { padding: 32px; max-width: 1400px; margin: 0 auto; }

        /* Stat cards */
        .stat-card { background: #fff; border-radius: 16px; padding: 22px; border: 1.5px solid #e2e8f0; display: flex; align-items: center; gap: 16px; transition: all 0.2s; cursor: default; }
        .stat-card:hover { border-color: #dbeafe; box-shadow: 0 4px 20px rgba(37,99,235,0.08); transform: translateY(-2px); }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-value { font-family: 'Sora', sans-serif; font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1; }
        .stat-label { color: #94a3b8; font-size: 0.78rem; margin: 4px 0 0; font-weight: 500; }
        .stat-sub { font-size: 0.72rem; font-weight: 600; margin: 3px 0 0; }

        /* Filter bar */
        .filter-bar { background: #fff; border-radius: 14px; padding: 16px 20px; border: 1.5px solid #e2e8f0; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .search-wrap { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 9px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 9px 14px; }
        .search-wrap input { border: none; background: transparent; outline: none; font-size: 0.875rem; color: #1e293b; width: 100%; }
        .search-wrap input::placeholder { color: #94a3b8; }
        .type-select { border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 9px 14px; font-size: 0.875rem; color: #475569; background: #f8fafc; outline: none; min-width: 140px; }
        .tab-pills { display: flex; gap: 6px; }
        .tab-pill { padding: 7px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: 1.5px solid transparent; transition: all 0.15s; color: #94a3b8; }
        .tab-pill.active { background: #eff6ff; color: #2563eb; border-color: #dbeafe; }
        .tab-pill:hover:not(.active) { background: #f1f5f9; color: #475569; }

        /* Table card */
        .table-card { background: #fff; border-radius: 16px; border: 1.5px solid #e2e8f0; overflow: hidden; }
        .table-head-bar { padding: 18px 24px; border-bottom: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .tbl { width: 100%; border-collapse: collapse; }
        .tbl thead th { padding: 12px 16px; font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; background: #f8fafc; border-bottom: 1.5px solid #f1f5f9; white-space: nowrap; }
        .tbl tbody td { padding: 14px 16px; font-size: 0.86rem; color: #64748b; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .tbl tbody tr:last-child td { border-bottom: none; }
        .tbl tbody tr:hover td { background: #f8fafc; }
        .item-name-cell { font-weight: 600; color: #0f172a; }
        .desc-truncate { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .badge-lost { display: inline-flex; align-items: center; gap: 5px; background: #fef2f2; color: #ef4444; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid #fecaca; }
        .badge-found { display: inline-flex; align-items: center; gap: 5px; background: #f0fdf4; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid #bbf7d0; }
        .cell-icon { display: inline-flex; align-items: center; gap: 5px; color: #64748b; }
        .action-btns { display: flex; gap: 6px; justify-content: center; }
        .icon-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; transition: all 0.15s; }
        .icon-btn:hover { transform: scale(1.1); }
        .icon-btn.edit:hover { background: #eff6ff; border-color: #dbeafe; color: #2563eb; }
        .icon-btn.del:hover { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

        /* Pagination */
        .pagination-bar { padding: 14px 20px; border-top: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #f8fafc; flex-wrap: wrap; gap: 12px; }
        .page-btns { display: flex; gap: 4px; flex-wrap: wrap; }
        .page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 0.82rem; font-weight: 600; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
        .page-btn.active { background: #2563eb; border-color: #2563eb; color: #fff; }
        .page-btn:hover:not(.active):not(.disabled) { border-color: #dbeafe; color: #2563eb; }
        .page-btn.disabled { opacity: 0.4; cursor: default; }

        /* Buttons */
        .btn-blue { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; box-shadow: 0 4px 12px rgba(37,99,235,0.3); transition: all 0.2s; }
        .btn-blue:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37,99,235,0.4); }
        .btn-ghost { background: #fff; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 9px 16px; font-size: 0.875rem; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #2563eb; color: #2563eb; }
        .btn-red-ghost { background: #fff; color: #ef4444; border: 1.5px solid #fecaca; border-radius: 10px; padding: 9px 16px; font-size: 0.875rem; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: all 0.2s; }
        .btn-red-ghost:hover { background: #fef2f2; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 20px; }
        .modal-box { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; box-shadow: 0 24px 60px rgba(0,0,0,0.18); overflow: hidden; animation: modalIn 0.2s ease; }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.97) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .modal-head { padding: 22px 28px; border-bottom: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; font-size: 1rem; transition: all 0.15s; }
        .modal-close:hover { background: #fef2f2; border-color: #fecaca; color: #ef4444; }
        .modal-body { padding: 24px 28px; }
        .modal-foot { padding: 18px 28px; border-top: 1.5px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; background: #f8fafc; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .fgroup { margin-bottom: 16px; }
        .fgroup label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 7px; }
        .fgroup input, .fgroup select, .fgroup textarea { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; font-size: 0.875rem; color: #1e293b; background: #f8fafc; outline: none; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
        .fgroup input:focus, .fgroup select:focus, .fgroup textarea:focus { border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

        /* Alerts */
        .alert-success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #166534; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 0.875rem; font-weight: 500; animation: slideDown 0.3s ease; }
        .alert-error { background: #fef2f2; border: 1.5px solid #fecaca; color: #991b1b; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 0.875rem; font-weight: 500; animation: slideDown 0.3s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 36px; height: 36px; border: 3px solid #dbeafe; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.7s linear infinite; }

        input[type="number"]::-webkit-inner-spin-button { opacity: 0.5; }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .main-content { padding: 20px; }
          .stat-card { padding: 16px; }
          .stat-value { font-size: 1.3rem; }
          .filter-bar { flex-direction: column; align-items: stretch; }
          .search-wrap { width: 100%; }
          .type-select { width: 100%; }
          .tab-pills { justify-content: center; }
          .table-head-bar { flex-direction: column; align-items: flex-start; }
          .action-btns { flex-direction: column; align-items: center; }
          .form-grid { grid-template-columns: 1fr; }
          .modal-body { padding: 20px; }
          .modal-head { padding: 16px 20px; }
          .modal-foot { padding: 16px 20px; }
        }
      `}</style>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="sora" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
              Dashboard
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '3px 0 0' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} &mdash; {items.length} items tracked
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn-ghost" onClick={fetchItems}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="btn-red-ghost" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
            <button className="btn-blue" onClick={() => handleOpenModal('create')}>
              <Plus size={14} /> Report Item
            </button>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="alert-success">
            <CheckCircle size={16} /> {success}
          </div>
        )}
        {error && (
          <div className="alert-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { icon: <Package size={22} color="#2563eb" />, bg: '#eff6ff', value: items.length, label: 'Total Items', sub: '↑ 3 this week', subColor: '#22c55e' },
            { icon: <AlertCircle size={22} color="#ef4444" />, bg: '#fef2f2', value: lostCount, label: 'Lost Items', sub: '↑ 2 new today', subColor: '#ef4444' },
            { icon: <CheckCircle size={22} color="#22c55e" />, bg: '#f0fdf4', value: foundCount, label: 'Found Items', sub: '↑ 1 recovered', subColor: '#22c55e' },
            { icon: <MapPin size={22} color="#f59e0b" />, bg: '#fffbeb', value: locationCount, label: 'Locations', sub: 'Across campus', subColor: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
                <p className="stat-sub" style={{ color: s.subColor }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="search-wrap">
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by item name..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <select
            className="type-select"
            value={typeFilter}
            onChange={(e) => handleTypeFilterChange(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="Lost">Lost Items</option>
            <option value="Found">Found Items</option>
          </select>
          <div className="tab-pills">
            {['all', 'Lost', 'Found'].map(t => (
              <div
                key={t}
                className={`tab-pill ${typeFilter === t ? 'active' : ''}`}
                onClick={() => handleTypeFilterChange(t)}
              >
                {t === 'all' ? 'All' : t}
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-head-bar">
            <span className="sora" style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
              Item Records
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Package size={52} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <h4 style={{ color: '#94a3b8', fontFamily: 'Sora', fontWeight: 700 }}>No items found</h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Click "Report Item" to create your first entry</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Contact</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={item._id}>
                      <td style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.75rem' }}>
                        {String(indexOfFirstItem + index + 1).padStart(2, '0')}
                      </td>
                      <td><span className="item-name-cell">{item.itemName}</span></td>
                      <td><span className="desc-truncate">{item.Description}</span></td>
                      <td>
                        {item.type === 'Lost'
                          ? <span className="badge-lost">● Lost</span>
                          : <span className="badge-found">● Found</span>}
                      </td>
                      <td>
                        <span className="cell-icon">
                          <MapPin size={12} color="#2563eb" /> {item.Location}
                        </span>
                      </td>
                      <td>
                        <span className="cell-icon">
                          <Calendar size={12} color="#2563eb" />
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td>
                        <span className="cell-icon">
                          <Phone size={12} color="#2563eb" /> {item.contactInfo}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <div className="icon-btn edit" onClick={() => handleOpenModal('edit', item)} title="Edit">
                            <Edit size={13} />
                          </div>
                          <div className="icon-btn del" onClick={() => deleteItem(item._id)} title="Delete">
                            <Trash2 size={13} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredItems.length > 0 && (
            <div className="pagination-bar">
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} results
              </span>
              <div className="page-btns">
                <div className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>‹</div>
                {[...Array(totalPages)].map((_, i) => (
                  <div key={i} className={`page-btn ${i + 1 === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </div>
                ))}
                <div className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>›</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="modal-box">
            <div className="modal-head">
              <h4 className="sora" style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', margin: 0 }}>
                {modalMode === 'create' ? '📦 Report New Item' : '✏️ Edit Item Details'}
              </h4>
              <div className="modal-close" onClick={handleCloseModal}>✕</div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="fgroup">
                    <label>Item Name *</label>
                    <input type="text" name="itemName" value={formData.itemName} onChange={handleInputChange} placeholder="e.g. Blue Backpack" required />
                  </div>
                  <div className="fgroup">
                    <label>Item Type *</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} required>
                      <option value="">Select type</option>
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                    </select>
                  </div>
                </div>
                <div className="fgroup">
                  <label>Description *</label>
                  <textarea rows={3} name="Description" value={formData.Description} onChange={handleInputChange} placeholder="Describe the item in detail..." required />
                </div>
                <div className="form-grid">
                  <div className="fgroup">
                    <label>Location *</label>
                    <input type="text" name="Location" value={formData.Location} onChange={handleInputChange} placeholder="Where was it lost/found?" required />
                  </div>
                  <div className="fgroup">
                    <label>Date *</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="fgroup" style={{ marginBottom: 0 }}>
                  <label>Contact Number *</label>
                  <input type="number" name="contactInfo" value={formData.contactInfo} onChange={handleInputChange} placeholder="Your phone number" required />
                  <small style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: 5, display: 'block' }}>Used for contact purposes only</small>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn-ghost" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-blue">
                  {modalMode === 'create' ? 'Report Item' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;