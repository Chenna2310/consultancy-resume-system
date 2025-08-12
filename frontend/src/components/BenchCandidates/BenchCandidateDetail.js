import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { benchCandidatesAPI, candidateActivitiesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BenchCandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActivityForm, setShowActivityForm] = useState(false);
  
  const [activityForm, setActivityForm] = useState({
    activityType: 'APPLIED',
    clientName: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    submittedRate: '',
    notes: '',
    activityDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCandidateDetails();
    fetchActivities();
  }, [id]);

  const fetchCandidateDetails = async () => {
    try {
      const response = await benchCandidatesAPI.getById(id);
      setCandidate(response.data);
    } catch (error) {
      toast.error('Failed to load candidate details');
      navigate('/bench-profiles');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await candidateActivitiesAPI.getByCandidateId(id);
      setActivities(response.data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const handleActivityFormChange = (e) => {
    setActivityForm({
      ...activityForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      await candidateActivitiesAPI.create({
        ...activityForm,
        candidateId: id
      });
      toast.success('Activity added successfully!');
      setShowActivityForm(false);
      setActivityForm({
        activityType: 'APPLIED',
        clientName: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        submittedRate: '',
        notes: '',
        activityDate: new Date().toISOString().split('T')[0]
      });
      fetchActivities();
    } catch (error) {
      toast.error('Failed to add activity');
    }
  };

  const handleDownloadResume = async () => {
    try {
      const response = await benchCandidatesAPI.downloadResume(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', candidate.resumeFilename || `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const getActivityTypeColor = (type) => {
    const colors = {
      'APPLIED': '#3B82F6',
      'SUBMITTED': '#10B981',
      'INTERVIEW_SCHEDULED': '#F59E0B',
      'INTERVIEW_COMPLETED': '#8B5CF6',
      'FEEDBACK_RECEIVED': '#6B7280',
      'REJECTED': '#EF4444',
      'ON_HOLD': '#F97316'
    };
    return colors[type] || '#6B7280';
  };

  const getActivityTypeDisplay = (type) => {
    const displays = {
      'APPLIED': 'Applied',
      'SUBMITTED': 'Submitted',
      'INTERVIEW_SCHEDULED': 'Interview Scheduled',
      'INTERVIEW_COMPLETED': 'Interview Completed',
      'FEEDBACK_RECEIVED': 'Feedback Received',
      'REJECTED': 'Rejected',
      'ON_HOLD': 'On Hold'
    };
    return displays[type] || type;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading candidate details...</div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Candidate not found</h2>
        <Link to="/bench-profiles" className="btn-primary">Back to Bench Profiles</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            {candidate.fullName}
          </h1>
          <p style={{ color: '#6B7280' }}>
            Bench Profile Details & Activities
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/bench-profiles/edit/${id}`} className="btn-secondary">
            ✏️ Edit Profile
          </Link>
          <Link to="/bench-profiles" className="btn-secondary">
            ← Back to List
          </Link>
        </div>
      </div>

      {/* Candidate Details Card */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          👤 Profile Information
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div><strong>Visa Status:</strong> {candidate.visaStatus}</div>
          <div><strong>Location:</strong> {candidate.city}, {candidate.state}</div>
          <div><strong>Primary Skill:</strong> {candidate.primarySkill}</div>
          <div><strong>Experience:</strong> {candidate.experienceYears} years</div>
          <div><strong>Phone:</strong> {candidate.phoneNumber}</div>
          <div><strong>Email:</strong> {candidate.email}</div>
          {candidate.targetRate && <div><strong>Target Rate:</strong> ${candidate.targetRate}/hr</div>}
          {candidate.assignedConsultantName && <div><strong>Assigned Consultant:</strong> {candidate.assignedConsultantName}</div>}
        </div>

        {candidate.notes && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
            <strong>Notes:</strong> {candidate.notes}
          </div>
        )}

        {candidate.resumeFilename && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleDownloadResume} className="btn-primary">
              📄 Download Resume ({candidate.resumeFilename})
            </button>
          </div>
        )}
      </div>

      {/* Activities Section */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '1.5rem 2rem', 
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            📊 Daily Activities & Progress
          </h3>
          <button 
            onClick={() => setShowActivityForm(!showActivityForm)}
            className="btn-primary"
          >
            {showActivityForm ? 'Cancel' : '+ Add Today\'s Activity'}
          </button>
        </div>

        {/* Activity Form */}
        {showActivityForm && (
          <div style={{ padding: '2rem', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Record Today's Activity for {candidate.fullName}
            </h4>
            <form onSubmit={handleAddActivity}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Activity Type *</label>
                  <select
                    name="activityType"
                    className="form-input"
                    value={activityForm.activityType}
                    onChange={handleActivityFormChange}
                    required
                  >
                    <option value="APPLIED">Applied to Job</option>
                    <option value="SUBMITTED">Submitted to Client</option>
                    <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                    <option value="INTERVIEW_COMPLETED">Interview Completed</option>
                    <option value="FEEDBACK_RECEIVED">Feedback Received</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Client/Company Name *</label>
                  <input
                    type="text"
                    name="clientName"
                    className="form-input"
                    value={activityForm.clientName}
                    onChange={handleActivityFormChange}
                    required
                    placeholder="e.g. Google, Microsoft, Amazon"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Point of Contact</label>
                  <input
                    type="text"
                    name="contactPerson"
                    className="form-input"
                    value={activityForm.contactPerson}
                    onChange={handleActivityFormChange}
                    placeholder="Contact person name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    className="form-input"
                    value={activityForm.contactPhone}
                    onChange={handleActivityFormChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    className="form-input"
                    value={activityForm.contactEmail}
                    onChange={handleActivityFormChange}
                    placeholder="contact@company.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Submitted Rate ($/hr)</label>
                  <input
                    type="number"
                    name="submittedRate"
                    className="form-input"
                    value={activityForm.submittedRate}
                    onChange={handleActivityFormChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 85"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Activity Date *</label>
                  <input
                    type="date"
                    name="activityDate"
                    className="form-input"
                    value={activityForm.activityDate}
                    onChange={handleActivityFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  className="form-input"
                  value={activityForm.notes}
                  onChange={handleActivityFormChange}
                  rows="3"
                  placeholder="Additional notes about this activity..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary">
                  Add Activity
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowActivityForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activities List */}
        <div style={{ padding: '2rem' }}>
          {activities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  style={{ 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    backgroundColor: '#FAFAFA'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span 
                        style={{
                          background: getActivityTypeColor(activity.activityType),
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}
                      >
                        {getActivityTypeDisplay(activity.activityType)}
                      </span>
                      <strong style={{ fontSize: '1.1rem' }}>{activity.clientName}</strong>
                    </div>
                    <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: '500' }}>
                      {new Date(activity.activityDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {activity.contactPerson && <div><strong>Contact:</strong> {activity.contactPerson}</div>}
                    {activity.contactPhone && <div><strong>Phone:</strong> {activity.contactPhone}</div>}
                    {activity.contactEmail && <div><strong>Email:</strong> {activity.contactEmail}</div>}
                    {activity.submittedRate && <div><strong>Rate:</strong> <span style={{ color: '#10B981', fontWeight: '600' }}>${activity.submittedRate}/hr</span></div>}
                  </div>
                  
                  {activity.notes && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#6B7280', fontStyle: 'italic', padding: '0.5rem', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
                      <strong>Notes:</strong> {activity.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6B7280', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No activities recorded yet</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Start tracking daily progress by clicking "Add Today's Activity" above
              </p>
              <button 
                onClick={() => setShowActivityForm(true)}
                className="btn-primary"
              >
                Add First Activity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenchCandidateDetail;