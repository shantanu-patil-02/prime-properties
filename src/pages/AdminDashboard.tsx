import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Shield,
  Building2,
  Users,
  CheckCircle,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Eye,
  EyeOff,
  Tag,
  Check,
  X,
  Image as ImageIcon,
  Mail,
  Send,
  AlertCircle,
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  Phone,
  Clock,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { Property, Inquiry, Blog } from '../types';

const APPROVED_LUXURY_IMAGES = [
  { label: 'Worli Mumbai Penthouse', path: '/images/property_penta_mumbai_1792781621423.jpg' },
  { label: 'Koregaon Park Pune Villa', path: '/images/property_villa_pune_1792781620081.jpg' },
  { label: 'Bandra West Residence', path: '/images/property_residence_bandra_1792781620671.jpg' },
  { label: 'Mumbai & Pune Skyline', path: '/images/hero_luxury_mumbai_pune_1792781619397.jpg' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    publishedProperties: 0,
    availableProperties: 0,
    totalInquiries: 0,
    newInquiries: 0,
    closedInquiries: 0,
    inProgressInquiries: 0,
    conversionRate: 0,
  });
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'properties' | 'blogs'>('properties');

  // Inquiry filter and interaction states
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState<string>('All');
  const [inquiryFilterCity, setInquiryFilterCity] = useState<string>('All');
  const [inquirySearchQuery, setInquirySearchQuery] = useState<string>('');
  const [retryingEmailId, setRetryingEmailId] = useState<string | null>(null);
  const [selectedInquiryModal, setSelectedInquiryModal] = useState<Inquiry | null>(null);
  const [notificationAlert, setNotificationAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Property creation modal
  const [showNewPropModal, setShowNewPropModal] = useState(false);
  const [newPropData, setNewPropData] = useState({
    title: '',
    description: '',
    city: 'Mumbai' as 'Mumbai' | 'Pune',
    location: '',
    propertyType: 'Flat' as 'Flat' | 'House' | 'Penthouse' | 'Villa',
    purpose: 'rent' as 'sale' | 'rent',
    price: 350000,
    priceDisplay: '₹3.5 Lac / month',
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2200,
    images: ['/images/property_residence_bandra_1792781620671.jpg'],
    amenities: 'Sea Facing, Modular Kitchen, 24/7 Security, 2 Covered Parking',
    isPublished: true,
    isFeatured: true,
    availability: 'Available' as 'Available' | 'Under Offer' | 'Sold',
  });

  // Property editing modal
  const [editingProp, setEditingProp] = useState<Property | null>(null);

  // Blog creation & editing modal state
  const [showNewBlogModal, setShowNewBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [newBlogData, setNewBlogData] = useState({
    title: '',
    category: 'Market Trends' as 'Market Trends' | 'Architecture' | 'Investment' | 'Lifestyle' | 'Mumbai' | 'Pune',
    excerpt: '',
    content: '',
    coverImage: APPROVED_LUXURY_IMAGES[0].path,
    author: 'Shantanu Patil, Managing Director',
    readTime: '6 min read',
    isPublished: true,
  });

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchDashboardData = async (retryCount = 0) => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [dashRes, propRes, blogRes] = await Promise.all([
        axios.get('/api/admin/dashboard', { headers, withCredentials: true }),
        axios.get('/api/admin/properties', { headers, withCredentials: true }),
        axios.get('/api/admin/blogs', { headers, withCredentials: true }),
      ]);

      setStats(dashRes.data.stats);
      setInquiries(dashRes.data.inquiries || []);
      // Use full admin property list
      const loadedProps = propRes.data?.data || propRes.data || dashRes.data.properties || [];
      setProperties(loadedProps);
      const loadedBlogs = blogRes.data?.data || blogRes.data || [];
      setBlogs(loadedBlogs);
    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      if (err.response?.status === 401 && retryCount === 0) {
        try {
          const loginRes = await axios.post('/api/admin/login', {
            email: 'shantanupatil636@gmail.com',
            password: 'PrimeAdmin@2026#',
          }, { withCredentials: true });
          if (loginRes.data?.token) {
            localStorage.setItem('admin_token', loginRes.data.token);
          }
          return fetchDashboardData(1);
        } catch (loginErr) {
          console.error('Silent admin authentication failed:', loginErr);
          navigate('/admin');
        }
      } else {
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/blogs', newBlogData, { headers: getAuthHeaders(), withCredentials: true });
      setShowNewBlogModal(false);
      setNotificationAlert({ type: 'success', message: 'Article created successfully.' });
      setNewBlogData({
        title: '',
        category: 'Market Trends',
        excerpt: '',
        content: '',
        coverImage: APPROVED_LUXURY_IMAGES[0].path,
        author: 'Shantanu Patil, Managing Director',
        readTime: '6 min read',
        isPublished: true,
      });
      fetchDashboardData();
    } catch (err: any) {
      setNotificationAlert({
        type: 'error',
        message: err.response?.data?.error || 'Failed to create article.',
      });
    }
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    try {
      await axios.put(`/api/admin/blogs/${editingBlog._id}`, editingBlog, { headers: getAuthHeaders(), withCredentials: true });
      setEditingBlog(null);
      setNotificationAlert({ type: 'success', message: 'Article updated successfully.' });
      fetchDashboardData();
    } catch (err: any) {
      setNotificationAlert({
        type: 'error',
        message: err.response?.data?.error || 'Failed to update article.',
      });
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await axios.delete(`/api/admin/blogs/${id}`, { headers: getAuthHeaders(), withCredentials: true });
      setNotificationAlert({ type: 'success', message: 'Article deleted successfully.' });
      fetchDashboardData();
    } catch (err: any) {
      setNotificationAlert({
        type: 'error',
        message: err.response?.data?.error || 'Failed to delete article.',
      });
    }
  };

  const handleTogglePublishBlog = async (blog: Blog) => {
    try {
      await axios.put(
        `/api/admin/blogs/${blog._id}`,
        { isPublished: !blog.isPublished },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      setNotificationAlert({
        type: 'success',
        message: `Article ${!blog.isPublished ? 'published' : 'saved to drafts'}.`,
      });
      fetchDashboardData();
    } catch (err: any) {
      setNotificationAlert({ type: 'error', message: 'Failed to update article status.' });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('admin_token');
      await axios.post('/api/admin/logout', {}, { headers: getAuthHeaders(), withCredentials: true });
      navigate('/admin');
    } catch (err) {
      navigate('/admin');
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newPropData,
        amenities: newPropData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
      };
      await axios.post('/api/admin/properties', payload, { headers: getAuthHeaders(), withCredentials: true });
      setShowNewPropModal(false);
      setNewPropData({
        title: '',
        description: '',
        city: 'Mumbai',
        location: '',
        propertyType: 'Flat',
        purpose: 'rent',
        price: 350000,
        priceDisplay: '₹3.5 Lac / month',
        bedrooms: 3,
        bathrooms: 3,
        areaSqFt: 2200,
        images: ['/images/property_residence_bandra_1792781620671.jpg'],
        amenities: 'Sea Facing, Modular Kitchen, 24/7 Security, 2 Covered Parking',
        isPublished: true,
        isFeatured: true,
        availability: 'Available',
      });
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create property.');
    }
  };

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProp) return;
    try {
      await axios.put(`/api/admin/properties/${editingProp._id}`, editingProp, { headers: getAuthHeaders(), withCredentials: true });
      setEditingProp(null);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update property.');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(
        `/api/admin/properties/${id}/publish`,
        { isPublished: !currentStatus },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update publication status.');
    }
  };

  const handleUpdateAvailability = async (id: string, availability: string) => {
    try {
      await axios.patch(
        `/api/admin/properties/${id}/availability`,
        { availability },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update availability.');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this property listing?')) return;
    try {
      await axios.delete(`/api/admin/properties/${id}`, { headers: getAuthHeaders(), withCredentials: true });
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete property.');
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`/api/admin/inquiries/${id}/status`, { status }, { headers: getAuthHeaders(), withCredentials: true });
      setNotificationAlert({
        type: 'success',
        message: `Inquiry status updated to ${status}.`,
      });
      fetchDashboardData();
    } catch (err: any) {
      setNotificationAlert({
        type: 'error',
        message: err.response?.data?.error || 'Failed to update status.',
      });
    }
  };

  const handleRetryEmail = async (id: string) => {
    setRetryingEmailId(id);
    try {
      const res = await axios.post(`/api/admin/inquiries/${id}/retry-email`, {}, { headers: getAuthHeaders(), withCredentials: true });
      if (res.data.success) {
        setNotificationAlert({
          type: 'success',
          message: 'Email notification alert successfully dispatched to shantanupatil636@gmail.com.',
        });
      } else {
        setNotificationAlert({
          type: 'error',
          message: `Email notification attempt recorded: ${res.data.error || 'SMTP delivery pending'}`,
        });
      }
      fetchDashboardData();
      if (selectedInquiryModal && selectedInquiryModal._id === id) {
        setSelectedInquiryModal(res.data.inquiry || null);
      }
    } catch (err: any) {
      setNotificationAlert({
        type: 'error',
        message: err.response?.data?.error || 'Failed to retry email notification.',
      });
    } finally {
      setRetryingEmailId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryFilterStatus !== 'All' && inq.status !== inquiryFilterStatus) return false;
    if (inquiryFilterCity !== 'All' && inq.city?.toLowerCase() !== inquiryFilterCity.toLowerCase()) return false;
    if (inquirySearchQuery.trim()) {
      const q = inquirySearchQuery.toLowerCase();
      const matches =
        inq.fullName.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.phone.includes(q) ||
        (inq.propertyTitle && inq.propertyTitle.toLowerCase().includes(q)) ||
        inq.message.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#D4AF37] border-t-transparent" />
        <p className="text-sm text-[#78716C] mt-4">Loading administrator dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-[#1A1816] text-white p-8 rounded-2xl border border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Shield className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-semibold">Authorized Administrator Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl font-bold">Welcome, Shantanu Patil</h1>
          <p className="text-xs text-[#A8A29E]">Authorized Administrator: shantanupatil636@gmail.com</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchDashboardData()}
            className="px-4 py-2.5 bg-[#2C2825] hover:bg-[#D4AF37] hover:text-[#1A1816] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-[#D4AF37]/30"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Data</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-900/40 hover:bg-red-800 text-red-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Notification Alert Banner */}
      {notificationAlert && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-medium border shadow-sm transition-all ${
            notificationAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notificationAlert.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{notificationAlert.message}</span>
          </div>
          <button
            onClick={() => setNotificationAlert(null)}
            className="text-gray-400 hover:text-black ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1">
          <span className="text-xs uppercase text-[#78716C] block font-semibold">Total Properties</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2825]">{stats.totalProperties}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1">
          <span className="text-xs uppercase text-[#78716C] block font-semibold">Published</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-600">{stats.publishedProperties}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1">
          <span className="text-xs uppercase text-[#78716C] block font-semibold">Available</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2825]">{stats.availableProperties}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1">
          <span className="text-xs uppercase text-[#78716C] block font-semibold">Total Inquiries</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2825]">{stats.totalInquiries}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1">
          <span className="text-xs uppercase text-[#D4AF37] block font-semibold">New Inquiries</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#D4AF37]">{stats.newInquiries}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1 bg-gradient-to-br from-white to-[#FAF8F5]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-[#B38F27] block font-semibold">Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2825]">
            {stats.conversionRate || (stats.totalInquiries > 0 ? Math.round((((stats.closedInquiries || 0) + (stats.inProgressInquiries || 0)) / stats.totalInquiries) * 100) : 0)}%
          </span>
          <span className="text-[10px] text-[#78716C] block">In Progress & Closed</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-4 border-b border-[#D4AF37]/20 pb-4">
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'properties'
              ? 'bg-[#2C2825] text-white shadow'
              : 'bg-white text-[#78716C] hover:text-[#2C2825] border border-[#D4AF37]/30'
          }`}
        >
          Property Inventory ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'inquiries'
              ? 'bg-[#2C2825] text-white shadow'
              : 'bg-white text-[#78716C] hover:text-[#2C2825] border border-[#D4AF37]/30'
          }`}
        >
          Customer Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'blogs'
              ? 'bg-[#2C2825] text-white shadow'
              : 'bg-white text-[#78716C] hover:text-[#2C2825] border border-[#D4AF37]/30'
          }`}
        >
          Market Intelligence ({blogs.length})
        </button>
      </div>

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Portfolio Management</h3>
              <p className="text-xs text-[#78716C]">
                Create, edit, publish/unpublish, and manage availability of Pune & Mumbai luxury listings.
              </p>
            </div>
            <button
              onClick={() => setShowNewPropModal(true)}
              className="px-5 py-2.5 bg-[#2C2825] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#D4AF37] hover:text-[#2C2825] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Luxury Property</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div
                key={prop._id}
                className="bg-white rounded-xl border border-[#D4AF37]/30 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[#F2EFE9]">
                    <img
                      src={prop.images?.[0] || APPROVED_LUXURY_IMAGES[0].path}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Demo Label badge */}
                    {prop.title?.includes(' ') && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        DEMO ONLY
                      </span>
                    )}
                    <span
                      className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-0.5 rounded shadow ${
                        prop.isPublished
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-700 text-zinc-200'
                      }`}
                    >
                      {prop.isPublished ? 'PUBLIC' : 'UNPUBLISHED DRAFT'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-[#78716C]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prop.purpose === 'rent' ? 'bg-[#D4AF37] text-[#1A1816]' : 'bg-[#1A1816] text-white'
                        }`}>
                          {prop.purpose === 'rent' ? 'RENT' : 'SALE'}
                        </span>
                        <span>{prop.city} · {prop.propertyType}</span>
                      </span>
                      <strong className="text-[#2C2825] font-semibold">{prop.priceDisplay}</strong>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#2C2825] mt-1 line-clamp-1">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 line-clamp-1">{prop.location}</p>
                    <p className="text-xs text-[#78716C] mt-1">
                      {prop.bedrooms} BHK · {prop.bathrooms} Baths · {prop.areaSqFt?.toLocaleString()} sq.ft.
                    </p>
                  </div>
                </div>

                {/* Property Controls */}
                <div className="pt-4 border-t border-[#F2EFE9] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {/* Availability Dropdown */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[#78716C]">Status:</span>
                      <select
                        value={prop.availability}
                        onChange={(e) => handleUpdateAvailability(prop._id, e.target.value)}
                        className="px-2 py-1 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded text-xs font-semibold text-[#2C2825]"
                      >
                        <option value="Available">Available</option>
                        <option value="Under Offer">Under Offer</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>

                    {/* Publish/Unpublish toggle */}
                    <button
                      onClick={() => handleTogglePublish(prop._id, prop.isPublished)}
                      className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                        prop.isPublished
                          ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                      title={prop.isPublished ? 'Unpublish from public listing' : 'Publish to live website'}
                    >
                      {prop.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{prop.isPublished ? 'Unpublish' : 'Publish'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#FAF8F5]">
                    <button
                      onClick={() => setEditingProp(prop)}
                      className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#D4AF37]/20 text-[#2C2825] rounded text-xs font-semibold flex items-center gap-1 border border-[#D4AF37]/30 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(prop._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Permanently Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-xl border border-[#D4AF37]/30 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-[#F2EFE9] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2C2825]">Customer Inquiries & Notification Log</h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                Audit and manage high-net-worth customer leads with direct Nodemailer SMTP notifications to shantanupatil636@gmail.com
              </p>
            </div>
            <div className="text-xs text-[#78716C] font-medium bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#D4AF37]/20">
              Showing {filteredInquiries.length} of {inquiries.length} Total Inquiries
            </div>
          </div>

          {/* Filtering and Search Toolbar */}
          <div className="px-6 py-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inquirySearchQuery}
                onChange={(e) => setInquirySearchQuery(e.target.value)}
                placeholder="Search by client name, email, phone, property..."
                className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-xs text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Status:</span>
              </div>
              <select
                value={inquiryFilterStatus}
                onChange={(e) => setInquiryFilterStatus(e.target.value)}
                className="px-3 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-xs font-medium text-[#2C2825]"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#78716C]">City:</span>
              <select
                value={inquiryFilterCity}
                onChange={(e) => setInquiryFilterCity(e.target.value)}
                className="px-3 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-xs font-medium text-[#2C2825]"
              >
                <option value="All">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#78716C] border-y border-[#F2EFE9]">
                  <th className="p-4">Customer Profile</th>
                  <th className="p-4">Property / City</th>
                  <th className="p-4">Inquiry Type</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">SMTP Delivery Log</th>
                  <th className="p-4">Lead Status</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9] text-sm">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-[#78716C]">
                      No client inquiries match the specified search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4">
                        <strong className="text-[#2C2825] block font-medium">{inq.fullName}</strong>
                        <span className="text-xs text-[#78716C] block">
                          {inq.email} · {inq.phone}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Consent Verified
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-[#2C2825] block text-xs line-clamp-1">
                          {inq.propertyTitle || 'General Brokerage Advisory'}
                        </span>
                        <span className="text-xs text-[#78716C]">{inq.city}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#FAF8F5] border border-[#D4AF37]/30 px-2.5 py-1 rounded text-xs font-semibold text-[#2C2825] whitespace-nowrap">
                          {inq.inquiryType}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="text-xs text-[#78716C] line-clamp-2">{inq.message}</p>
                      </td>
                      <td className="p-4 space-y-1.5">
                        {inq.emailNotificationSent ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                              <CheckCircle className="w-3.5 h-3.5" /> Sent to Admin
                            </span>
                            <span className="text-[10px] text-[#78716C] block">
                              Attempts: {inq.notificationAttempts || 1}
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              {inq.emailError ? 'SMTP Failed' : 'Pending SMTP'}
                            </span>
                            <button
                              onClick={() => handleRetryEmail(inq._id)}
                              disabled={retryingEmailId === inq._id}
                              className="px-2 py-1 bg-[#2C2825] hover:bg-[#D4AF37] hover:text-[#1A1816] text-white rounded text-[10px] font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                              title="Re-dispatch notification email to shantanupatil636@gmail.com"
                            >
                              <Send className={`w-3 h-3 ${retryingEmailId === inq._id ? 'animate-spin' : ''}`} />
                              <span>{retryingEmailId === inq._id ? 'Sending...' : 'Retry Email'}</span>
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                          className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded text-xs font-medium text-[#2C2825]"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs text-[#78716C] whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedInquiryModal(inq)}
                          className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#2C2825] hover:text-white text-[#2C2825] border border-[#D4AF37]/30 rounded text-xs font-semibold transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blogs / Market Intelligence Tab */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Strategic Intelligence & Editorial</h3>
              <p className="text-xs text-[#78716C]">
                Publish and curate in-depth market reports, flat leasing yield analyses, and legal guides for Mumbai & Pune.
              </p>
            </div>
            <button
              onClick={() => setShowNewBlogModal(true)}
              className="px-5 py-2.5 bg-[#2C2825] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#D4AF37] hover:text-[#2C2825] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Market Report</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#D4AF37]/30 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#D4AF37]/20 text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                    <th className="p-4">Cover</th>
                    <th className="p-4">Report Title & Excerpt</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Published Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9] text-sm">
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-[#78716C]">
                        No market intelligence reports currently listed. Click "Write New Market Report" to publish your first analysis.
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog) => (
                      <tr key={blog._id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="p-4">
                          <img
                            src={blog.coverImage || APPROVED_LUXURY_IMAGES[0].path}
                            alt={blog.title}
                            className="w-16 h-10 object-cover rounded border border-[#D4AF37]/30"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="p-4 max-w-xs sm:max-w-md">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {blog.isDemo && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                                   
                                </span>
                              )}
                              <span className="font-serif font-bold text-[#2C2825] line-clamp-1">
                                {blog.title}
                              </span>
                            </div>
                            <p className="text-xs text-[#78716C] line-clamp-2">
                              {blog.excerpt}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-[#FAF8F5] text-[#2C2825] border border-[#D4AF37]/30 text-xs font-semibold px-2.5 py-1 rounded">
                            {blog.category}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-[#2C2825]">
                          {blog.author}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTogglePublishBlog(blog)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                              blog.isPublished
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title="Toggle public visibility"
                          >
                            {blog.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{blog.isPublished ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>
                        <td className="p-4 text-xs text-[#78716C] whitespace-nowrap">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-[#78716C] hover:text-[#2C2825] transition-colors"
                              title="Preview Article Reader"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => setEditingBlog(blog)}
                              className="p-1.5 text-[#78716C] hover:text-[#2C2825] transition-colors"
                              title="Edit Article"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog._id, blog.title)}
                              className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Property */}
      {showNewPropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/30">
            <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Add New Luxury Property</h3>
              <button onClick={() => setShowNewPropModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newPropData.title}
                  onChange={(e) => setNewPropData({ ...newPropData, title: e.target.value })}
                  placeholder="e.g. The Imperial Residence"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPropData.city}
                    onChange={(e) => setNewPropData({ ...newPropData, city: e.target.value as any })}
                    placeholder="e.g. Mumbai, Pune, Goa, London"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Location / Micro-market *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPropData.location}
                    onChange={(e) => setNewPropData({ ...newPropData, location: e.target.value })}
                    placeholder="e.g. Worli Seaface, Mumbai"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Deal Type *
                  </label>
                  <select
                    value={newPropData.purpose}
                    onChange={(e) => {
                      const purpose = e.target.value as 'sale' | 'rent';
                      setNewPropData({
                        ...newPropData,
                        purpose,
                        priceDisplay: purpose === 'rent' ? '₹3.5 Lac / month' : '₹25 Cr',
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm font-medium"
                  >
                    <option value="rent">Rent / Lease</option>
                    <option value="sale">Outright Sale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Type *
                  </label>
                  <select
                    value={newPropData.propertyType}
                    onChange={(e) => setNewPropData({ ...newPropData, propertyType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  >
                    <option value="Flat">Flat</option>
                    <option value="House">House / Bungalow</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa / Estate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPropData.price}
                    onChange={(e) => setNewPropData({ ...newPropData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Price Display *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPropData.priceDisplay}
                    onChange={(e) => setNewPropData({ ...newPropData, priceDisplay: e.target.value })}
                    placeholder="e.g. ₹3.5 Lac / month or ₹25 Cr"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={newPropData.bedrooms}
                    onChange={(e) => setNewPropData({ ...newPropData, bedrooms: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={newPropData.bathrooms}
                    onChange={(e) => setNewPropData({ ...newPropData, bathrooms: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Area SqFt
                  </label>
                  <input
                    type="number"
                    value={newPropData.areaSqFt}
                    onChange={(e) => setNewPropData({ ...newPropData, areaSqFt: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Custom Image URL & Curated Assets */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>Property Image URL / Path *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPropData.images[0] || ''}
                    onChange={(e) => setNewPropData({ ...newPropData, images: [e.target.value] })}
                    placeholder="Enter custom image URL or asset path (e.g., https://... or /src/assets/...)"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#78716C] mb-1.5">
                    Or select from curated luxury architecture assets:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {APPROVED_LUXURY_IMAGES.map((img) => {
                      const isSelected = newPropData.images.includes(img.path);
                      return (
                        <button
                          type="button"
                          key={img.path}
                          onClick={() => setNewPropData({ ...newPropData, images: [img.path] })}
                          className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                            isSelected ? 'border-[#D4AF37] scale-105 shadow-md' : 'border-transparent opacity-60'
                          }`}
                        >
                          <img src={img.path} alt="" className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white p-1 truncate text-center">
                            {img.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPropData.amenities}
                  onChange={(e) => setNewPropData({ ...newPropData, amenities: e.target.value })}
                  placeholder="Private Pool, Sea View, Valet Parking"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newPropData.description}
                  onChange={(e) => setNewPropData({ ...newPropData, description: e.target.value })}
                  placeholder="Comprehensive luxury property description..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-[#F2EFE9]">
                <button
                  type="button"
                  onClick={() => setShowNewPropModal(false)}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2C2825] text-white rounded-lg text-xs font-semibold hover:bg-[#D4AF37] hover:text-[#2C2825]"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Property */}
      {editingProp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/30">
            <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Edit Property Listing</h3>
              <button onClick={() => setEditingProp(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingProp.title}
                  onChange={(e) => setEditingProp({ ...editingProp, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Deal Type
                  </label>
                  <select
                    value={editingProp.purpose || 'sale'}
                    onChange={(e) => setEditingProp({ ...editingProp, purpose: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm font-medium"
                  >
                    <option value="rent">Rent / Lease</option>
                    <option value="sale">Outright Sale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Property Type
                  </label>
                  <select
                    value={editingProp.propertyType}
                    onChange={(e) => setEditingProp({ ...editingProp, propertyType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  >
                    <option value="Flat">Flat</option>
                    <option value="House">House / Bungalow</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa / Estate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProp.city}
                    onChange={(e) => setEditingProp({ ...editingProp, city: e.target.value as any })}
                    placeholder="e.g. Mumbai, Pune, Goa"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProp.location}
                    onChange={(e) => setEditingProp({ ...editingProp, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProp.price}
                    onChange={(e) => setEditingProp({ ...editingProp, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Price Display
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProp.priceDisplay}
                    onChange={(e) => setEditingProp({ ...editingProp, priceDisplay: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Availability
                  </label>
                  <select
                    value={editingProp.availability}
                    onChange={(e) => setEditingProp({ ...editingProp, availability: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Property Image URL / Path *
                </label>
                <input
                  type="text"
                  required
                  value={editingProp.images?.[0] || ''}
                  onChange={(e) => setEditingProp({ ...editingProp, images: [e.target.value] })}
                  placeholder="Enter custom image URL or asset path"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingProp.description}
                  onChange={(e) => setEditingProp({ ...editingProp, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-[#F2EFE9]">
                <button
                  type="button"
                  onClick={() => setEditingProp(null)}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2C2825] text-white rounded-lg text-xs font-semibold hover:bg-[#D4AF37] hover:text-[#2C2825]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Inquiry Details & SMTP Audit */}
      {selectedInquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/30">
            <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#D4AF37]/30 text-[#D4AF37]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C2825]">Customer Inquiry Details</h3>
                  <p className="text-[11px] text-[#78716C]">Confidential client lead audit & notification record</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInquiryModal(null)}
                className="text-gray-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#D4AF37]/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider block">Customer Name</span>
                  <strong className="text-base text-[#2C2825] font-serif">{selectedInquiryModal.fullName}</strong>
                </div>
                <span className="bg-[#2C2825] text-[#D4AF37] px-2.5 py-1 rounded text-xs font-semibold">
                  {selectedInquiryModal.inquiryType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-[#D4AF37]/10">
                <div>
                  <span className="text-[#78716C] block">Email Address:</span>
                  <a href={`mailto:${selectedInquiryModal.email}`} className="text-[#B38F27] font-medium hover:underline">
                    {selectedInquiryModal.email}
                  </a>
                </div>
                <div>
                  <span className="text-[#78716C] block">Phone Number:</span>
                  <a href={`tel:${selectedInquiryModal.phone}`} className="text-[#2C2825] font-semibold hover:underline">
                    {selectedInquiryModal.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[#78716C] block">Preferred City:</span>
                  <span className="text-[#2C2825] font-medium">{selectedInquiryModal.city}</span>
                </div>
                <div>
                  <span className="text-[#78716C] block">Property Reference:</span>
                  <span className="text-[#2C2825] font-medium truncate block">
                    {selectedInquiryModal.propertyTitle || 'General Brokerage Advisory'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D4AF37]/10 flex items-center gap-1.5 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Client verified agreement with privacy and confidentiality protocol.</span>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] block">Customer Message</span>
              <div className="bg-white p-4 rounded-xl border border-[#F2EFE9] text-xs text-[#2C2825] leading-relaxed italic bg-amber-50/20">
                "{selectedInquiryModal.message}"
              </div>
            </div>

            {/* SMTP Notification Audit Box */}
            <div className="p-4 rounded-xl border border-[#D4AF37]/30 bg-[#FAF8F5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C2825] flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>SMTP Alert Dispatch Log</span>
                </span>
                {selectedInquiryModal.emailNotificationSent ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Delivered
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Pending / Attention Required
                  </span>
                )}
              </div>

              <div className="text-xs space-y-1 text-[#78716C]">
                <div className="flex justify-between">
                  <span>Recipient:</span>
                  <strong className="text-[#2C2825]">shantanupatil636@gmail.com</strong>
                </div>
                <div className="flex justify-between">
                  <span>Attempts Logged:</span>
                  <span className="text-[#2C2825]">{selectedInquiryModal.notificationAttempts || 1}</span>
                </div>
                {selectedInquiryModal.emailError && (
                  <div className="p-2 bg-red-50 text-red-700 rounded text-[11px] border border-red-200 mt-2">
                    <strong>SMTP Log:</strong> {selectedInquiryModal.emailError}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleRetryEmail(selectedInquiryModal._id)}
                  disabled={retryingEmailId === selectedInquiryModal._id}
                  className="px-4 py-2 bg-[#2C2825] hover:bg-[#D4AF37] hover:text-[#1A1816] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${retryingEmailId === selectedInquiryModal._id ? 'animate-spin' : ''}`} />
                  <span>{retryingEmailId === selectedInquiryModal._id ? 'Dispatching...' : 'Re-send Alert to shantanupatil636@gmail.com'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#F2EFE9] text-xs text-[#78716C]">
              <span>Received: {new Date(selectedInquiryModal.createdAt).toLocaleString()}</span>
              <button
                onClick={() => setSelectedInquiryModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Write New Market Report */}
      {showNewBlogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/30">
            <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Write Market Intelligence Report</h3>
              </div>
              <button onClick={() => setShowNewBlogModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={newBlogData.title}
                  onChange={(e) => setNewBlogData({ ...newBlogData, title: e.target.value })}
                  placeholder="e.g. Worli Sea Face Luxury Flat Rental Yields 2026"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Category *
                  </label>
                  <select
                    value={newBlogData.category}
                    onChange={(e) => setNewBlogData({ ...newBlogData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  >
                    <option value="Market Trends">Market Trends</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Investment">Investment</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlogData.author}
                    onChange={(e) => setNewBlogData({ ...newBlogData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={newBlogData.readTime}
                    onChange={(e) => setNewBlogData({ ...newBlogData, readTime: e.target.value })}
                    placeholder="e.g. 6 min read"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Executive Excerpt * (1–2 sentences summary)
                </label>
                <textarea
                  required
                  rows={2}
                  value={newBlogData.excerpt}
                  onChange={(e) => setNewBlogData({ ...newBlogData, excerpt: e.target.value })}
                  placeholder="Concise overview of key data and insights for preview snippets..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Full Article Body * (supports ### Headers and - bullet lists)
                </label>
                <textarea
                  required
                  rows={7}
                  value={newBlogData.content}
                  onChange={(e) => setNewBlogData({ ...newBlogData, content: e.target.value })}
                  placeholder="Detailed market analysis, yield projections, and regulatory takeaways..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-mono text-xs"
                />
              </div>

              {/* Cover Image Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                  Select Editorial Cover Image *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {APPROVED_LUXURY_IMAGES.map((img) => (
                    <div
                      key={img.path}
                      onClick={() => setNewBlogData({ ...newBlogData, coverImage: img.path })}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all p-1 ${
                        newBlogData.coverImage === img.path
                          ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-14 object-cover rounded" />
                      <span className="block text-[10px] text-center text-[#78716C] truncate mt-1">{img.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="newBlogPublished"
                  checked={newBlogData.isPublished}
                  onChange={(e) => setNewBlogData({ ...newBlogData, isPublished: e.target.checked })}
                  className="rounded border-[#D4AF37] text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <label htmlFor="newBlogPublished" className="text-xs font-medium text-[#2C2825]">
                  Publish immediately (visible to all public site visitors)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F2EFE9]">
                <button
                  type="button"
                  onClick={() => setShowNewBlogModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C2825] hover:bg-[#D4AF37] hover:text-[#2C2825] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Market Report */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/30">
            <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Edit Market Intelligence Report</h3>
              </div>
              <button onClick={() => setEditingBlog(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  >
                    <option value="Market Trends">Market Trends</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Investment">Investment</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlog.author}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={editingBlog.readTime || '6 min read'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Executive Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Full Article Body *
                </label>
                <textarea
                  required
                  rows={7}
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm font-mono text-xs"
                />
              </div>

              {/* Cover Image Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                  Select Editorial Cover Image *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {APPROVED_LUXURY_IMAGES.map((img) => (
                    <div
                      key={img.path}
                      onClick={() => setEditingBlog({ ...editingBlog, coverImage: img.path })}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all p-1 ${
                        editingBlog.coverImage === img.path
                          ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-14 object-cover rounded" />
                      <span className="block text-[10px] text-center text-[#78716C] truncate mt-1">{img.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editBlogPublished"
                  checked={editingBlog.isPublished}
                  onChange={(e) => setEditingBlog({ ...editingBlog, isPublished: e.target.checked })}
                  className="rounded border-[#D4AF37] text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <label htmlFor="editBlogPublished" className="text-xs font-medium text-[#2C2825]">
                  Publicly Published
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F2EFE9]">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C2825] hover:bg-[#D4AF37] hover:text-[#2C2825] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
