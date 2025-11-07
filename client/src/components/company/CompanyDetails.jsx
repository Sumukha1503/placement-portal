import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  Users, 
  DollarSign, 
  Calendar, 
  Briefcase, 
  ArrowLeft,
  Star,
  TrendingUp,
  Award,
  ExternalLink
} from 'lucide-react';
import api from '../../services/api';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const decodedName = decodeURIComponent(id);
      const response = await api.get(`/api/companies/${decodedName}`);
      setCompany(response.data.company);
    } catch (error) {
      console.error('Error fetching company details:', error);
      setError('Failed to fetch company details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Building className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">{error}</h3>
        <div className="mt-6">
          <button
            onClick={() => navigate('/companies')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Company not found</h3>
        <p className="mt-1 text-sm text-gray-500">The company you're looking for doesn't exist.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/companies')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/companies')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Companies
        </button>
      </div>

      {/* Company Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start">
            <img 
              src={company.logo || `https://ui-avatars.com/api/?name=${company.name}&background=random`} 
              alt={company.name}
              className="h-20 w-20 rounded-lg object-contain bg-gray-100"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${company.name}&size=80&background=random`;
              }}
            />
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                  <p className="text-gray-600 mt-1">{company.industry}</p>
                  {company.location && (
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {company.location}
                    </div>
                  )}
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        4.5 (1240 reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600">Avg. Package</p>
                    <p className="text-xl font-bold text-blue-700">{company.avgPackage}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="inline-flex items-center px-3 py-1 border border-transparent rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'drives', 'roles'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">About {company.name}</h2>
                <p className="mt-2 text-gray-600">{company.description || `Details about ${company.name}`}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  <p className="mt-2 text-sm text-gray-600">Total Drives</p>
                  <p className="text-lg font-semibold text-gray-900">{company.totalDrives}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Users className="h-6 w-6 text-green-600" />
                  <p className="mt-2 text-sm text-gray-600">Applications</p>
                  <p className="text-lg font-semibold text-gray-900">{company.totalApplications}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Award className="h-6 w-6 text-purple-600" />
                  <p className="mt-2 text-sm text-gray-600">Students Selected</p>
                  <p className="text-lg font-semibold text-gray-900">{company.selectedStudents}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                  <p className="mt-2 text-sm text-gray-600">Avg. Package</p>
                  <p className="text-lg font-semibold text-gray-900">{company.avgPackage}</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'drives' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Drives</h2>
              {company.recentDrives && company.recentDrives.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {company.recentDrives.map((drive, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{drive.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drive.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drive.package}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No recent drives information available.</p>
              )}
            </div>
          )}
          
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Roles Offered</h2>
              {company.roles && company.roles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.roles.map((role, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                      <h3 className="text-md font-medium text-gray-900">{role}</h3>
                      <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium">
                        Apply for this role
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No roles information available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;