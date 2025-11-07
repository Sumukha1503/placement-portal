import { useState } from 'react';
import { Send, Sparkles, Users } from 'lucide-react';
import api from '../../services/api';

const EmailComposer = () => {
  const [emailData, setEmailData] = useState({
    recipients: 'all',
    subject: '',
    body: '',
    driveId: ''
  });
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);

  const handleGenerateWithAI = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/api/ai/generate-email', {
        studentName: '[Student Name]',
        companyName: emailData.driveId ? 'Selected Company' : 'Company Name',
        status: 'Drive Announcement',
        tone: 'professional'
      });

      setEmailData({
        ...emailData,
        subject: res.data.email.subject,
        body: res.data.email.body
      });
    } catch (error) {
      alert('Error generating email with AI');
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!emailData.subject || !emailData.body) {
      alert('Please fill in subject and body');
      return;
    }

    setSending(true);
    try {
      await api.post('/api/tpo/emails/send', emailData);
      alert('Emails sent successfully!');
      setEmailData({ recipients: 'all', subject: '', body: '', driveId: '' });
    } catch (error) {
      alert('Error sending emails');
    } finally {
      setSending(false);
    }
  };

  const templates = [
    {
      name: 'Drive Announcement',
      subject: 'New Placement Opportunity - {{company}}',
      body: 'Dear {{student}},\n\nWe are excited to announce a new placement opportunity with {{company}} for the role of {{role}}.\n\nPackage: {{package}}\nDeadline: {{deadline}}\n\nLog in to the portal to apply.\n\nBest regards,\nPlacement Cell'
    },
    {
      name: 'Shortlist Notification',
      subject: 'Congratulations! Shortlisted for {{company}}',
      body: 'Dear {{student}},\n\nCongratulations! You have been shortlisted for the next round with {{company}}.\n\nRound: {{round}}\nDate: {{date}}\nVenue: {{venue}}\n\nAll the best!\n\nBest regards,\nPlacement Cell'
    },
    {
      name: 'Selection Notification',
      subject: '🎉 Congratulations on Your Selection!',
      body: 'Dear {{student}},\n\nWe are thrilled to inform you that you have been selected by {{company}} for the position of {{role}}.\n\nPackage: {{package}}\n\nYour offer letter is available for download in the portal.\n\nCongratulations once again!\n\nBest regards,\nPlacement Cell'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Email Center
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Send bulk emails to students with AI-powered templates
        </p>
      </div>

      {/* Email Composer */}
      <div className="p-6 rounded-xl space-y-6" style={{ background: 'var(--bg-secondary)' }}>
        {/* Recipients */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Recipients
          </label>
          <select
            value={emailData.recipients}
            onChange={(e) => setEmailData({ ...emailData, recipients: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border"
            style={{
              background: 'var(--bg-primary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">All Students</option>
            <option value="placed">Placed Students Only</option>
            <option value="unplaced">Unplaced Students Only</option>
            <option value="specific-drive">Students Applied to Specific Drive</option>
          </select>
        </div>

        {/* AI Generate Button */}
        <button
          onClick={handleGenerateWithAI}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          <Sparkles size={18} />
          {generating ? 'Generating with AI...' : 'Generate Email with AI'}
        </button>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Subject
          </label>
          <input
            type="text"
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            placeholder="Email subject..."
            className="w-full px-4 py-3 rounded-lg border"
            style={{
              background: 'var(--bg-primary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Email Body
          </label>
          <textarea
            value={emailData.body}
            onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
            placeholder="Compose your email..."
            rows={12}
            className="w-full px-4 py-3 rounded-lg border"
            style={{
              background: 'var(--bg-primary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          />
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
            Use placeholders: {'{'}{'{'}}student{'}'}{'}'}, {'{'}{'{'}}company{'}'}{'}'}, {'{'}{'{'}}role{'}'}{'}'}, {'{'}{'{'}}package{'}'}{'}'}, {'{'}{'{'}}deadline{'}'}{'}'}
          </p>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg font-medium text-lg transition-all disabled:opacity-50"
          style={{ background: 'var(--success)', color: 'white' }}
        >
          <Send size={20} />
          {sending ? 'Sending Emails...' : 'Send Emails'}
        </button>
      </div>

      {/* Email Templates */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Quick Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => setEmailData({
                ...emailData,
                subject: template.subject,
                body: template.body
              })}
              className="p-4 rounded-lg border text-left transition-all hover:scale-105"
              style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {template.name}
              </h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Click to use this template
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;
