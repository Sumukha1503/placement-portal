import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import api from '../../services/api';

const ResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');
  const [currentResume, setCurrentResume] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf')) {
      setError('Only PDF files are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await api.post('/api/students/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setParsedData(res.data.parsedData);
      setCurrentResume(URL.createObjectURL(file));
      alert('Resume uploaded and parsed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading resume');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Upload Resume
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Upload your resume for AI-powered parsing and ATS scoring
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragActive ? 'scale-105' : ''
        }`}
        style={{
          background: isDragActive ? 'var(--accent)' + '10' : 'var(--bg-secondary)',
          borderColor: isDragActive ? 'var(--accent)' : 'var(--border)'
        }}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {uploading ? (
            <>
              <Loader className="mx-auto mb-4 animate-spin" size={48} style={{ color: 'var(--accent)' }} />
              <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                Uploading and parsing resume...
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                AI is extracting your skills and experience
              </p>
            </>
          ) : (
            <>
              <Upload className="mx-auto mb-4" size={48} style={{ color: 'var(--accent)' }} />
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                or click to browse • PDF only • Max 5MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg" 
             style={{ background: 'var(--error)' + '20', color: 'var(--error)' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Parsed Data Display */}
      {parsedData && (
        <div className="space-y-4">
          {/* ATS Score */}
          <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ATS Compatibility Score
              </h3>
              <div className="text-3xl font-bold" style={{ 
                color: parsedData.atsScore >= 70 ? 'var(--success)' : 
                       parsedData.atsScore >= 50 ? 'var(--warning)' : 'var(--error)'
              }}>
                {parsedData.atsScore}/100
              </div>
            </div>
            <div className="w-full h-3 rounded-full" style={{ background: 'var(--bg-primary)' }}>
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${parsedData.atsScore}%`,
                  background: parsedData.atsScore >= 70 ? 'var(--success)' : 
                             parsedData.atsScore >= 50 ? 'var(--warning)' : 'var(--error)'
                }}
              />
            </div>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              {parsedData.atsScore >= 70 ? '✅ Excellent! Your resume is ATS-friendly' :
               parsedData.atsScore >= 50 ? '⚠️ Good, but can be improved' :
               '❌ Needs improvement for better ATS compatibility'}
            </p>
          </div>

          {/* Extracted Skills */}
          {parsedData.skills && parsedData.skills.length > 0 && (
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Extracted Skills ({parsedData.skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {(parsedData.email || parsedData.phone) && (
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedData.email && (
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Email
                    </p>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {parsedData.email}
                    </p>
                  </div>
                )}
                {parsedData.phone && (
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Phone
                    </p>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {parsedData.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Experience */}
          {parsedData.experience && parsedData.experience.length > 0 && (
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Experience
              </h3>
              <div className="space-y-3">
                {parsedData.experience.map((exp, index) => (
                  <div key={index} className="p-4 rounded-lg border"
                       style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {exp.role || 'Position'}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {exp.company} • {exp.duration}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {parsedData.education && parsedData.education.length > 0 && (
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Education
              </h3>
              <div className="space-y-3">
                {parsedData.education.map((edu, index) => (
                  <div key={index} className="p-4 rounded-lg border"
                       style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {edu.degree}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {edu.institution} • {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {parsedData.certifications && parsedData.certifications.length > 0 && (
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Certifications
              </h3>
              <ul className="space-y-2">
                {parsedData.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
