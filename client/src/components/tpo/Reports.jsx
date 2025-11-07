import { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import api from '../../services/api';

const Reports = () => {
  const [reportType, setReportType] = useState('overall');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [generating, setGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('excel'); // Track selected format

  const handleGenerateReport = async (format) => {
    setGenerating(true);
    try {
      // Set the selected format
      setSelectedFormat(format);
      
      // For now, we'll use the same endpoint as HOD since we don't have a specific TPO report endpoint
      // In a real implementation, this would call a TPO-specific endpoint
      const response = await api.get(`/api/hod/reports/department?format=${format === 'excel' ? 'csv' : 'pdf'}`, { 
        responseType: 'blob' // Important for downloading files
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { 
        type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tpo-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleQuickReport = async (reportName) => {
    try {
      // In a real implementation, this would call an API endpoint to generate and download a quick report
      alert(`Quick report "${reportName}" would be generated and downloaded in your selected format.`);
    } catch (error) {
      console.error('Error generating quick report:', error);
      alert('Error generating quick report. Please try again.');
    }
  };

  const reportTypes = [
    { value: 'overall', label: 'Overall Summary', description: 'College-wide placement statistics' },
    { value: 'department-wise', label: 'Department-wise Report', description: 'Breakdown by department' },
    { value: 'company-wise', label: 'Company-wise Report', description: 'Recruitment by company' },
    { value: 'package-wise', label: 'Package-wise Report', description: 'Package distribution analysis' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Generate Reports
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Download comprehensive placement reports in Excel/PDF format
        </p>
      </div>

      {/* Report Configuration */}
      <div className="p-6 rounded-xl space-y-6" style={{ background: 'var(--bg-secondary)' }}>
        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Select Report Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((type) => (
              <div
                key={type.value}
                onClick={() => setReportType(type.value)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  reportType === type.value ? 'scale-105' : ''
                }`}
                style={{
                  background: reportType === type.value ? 'var(--accent)' + '10' : 'var(--bg-primary)',
                  borderColor: reportType === type.value ? 'var(--accent)' : 'var(--border)'
                }}
              >
                <div className="flex items-start gap-3">
                  <FileText size={24} style={{ 
                    color: reportType === type.value ? 'var(--accent)' : 'var(--text-secondary)' 
                  }} />
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {type.label}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {type.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Date Range (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="block text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Export Format
          </label>
          <div className="flex gap-4">
            <button 
              onClick={() => handleGenerateReport('excel')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
              style={{ background: 'var(--success)', color: 'white' }}>
              <FileText size={18} />
              Excel (.xlsx)
            </button>
            <button 
              onClick={() => handleGenerateReport('pdf')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
              style={{ background: 'var(--error)', color: 'white' }}>
              <FileText size={18} />
              PDF (.pdf)
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => handleGenerateReport(selectedFormat)}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg font-medium text-lg transition-all disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          <Download size={20} />
          {generating ? 'Generating Report...' : 'Generate & Download Report'}
        </button>
      </div>

      {/* Quick Reports */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Quick Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleQuickReport('Current Month')}
            className="p-4 rounded-lg border text-left transition-all hover:scale-105"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <Calendar size={20} className="mb-2" style={{ color: 'var(--accent)' }} />
            <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Current Month
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Placement report for this month
            </p>
          </button>

          <button 
            onClick={() => handleQuickReport('Current Year')}
            className="p-4 rounded-lg border text-left transition-all hover:scale-105"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <Calendar size={20} className="mb-2" style={{ color: 'var(--success)' }} />
            <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Current Year
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Annual placement statistics
            </p>
          </button>

          <button 
            onClick={() => handleQuickReport('All Time')}
            className="p-4 rounded-lg border text-left transition-all hover:scale-105"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <FileText size={20} className="mb-2" style={{ color: 'var(--warning)' }} />
            <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              All Time
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Complete placement history
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;