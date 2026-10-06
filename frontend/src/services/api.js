const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';


export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchDashboardAnalytics(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/analytics/dashboard?${query}`);
  return res.json();
}

export async function fetchObservations(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/observations?${query}`);
  return res.json();
}

export async function createObservation(data) {
  const res = await fetch(`${API_BASE}/observations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteObservation(id, token) {
  const res = await fetch(`${API_BASE}/observations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchSurveyStats() {
  const res = await fetch(`${API_BASE}/surveys/stats`);
  return res.json();
}

export async function submitSurvey(data) {
  const res = await fetch(`${API_BASE}/surveys/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchLocations() {
  const res = await fetch(`${API_BASE}/locations`);
  return res.json();
}

export async function updateLocation(id, data, token) {
  const res = await fetch(`${API_BASE}/locations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchCampaigns() {
  const res = await fetch(`${API_BASE}/campaigns`);
  return res.json();
}

export async function createCampaign(data, token) {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteCampaign(id, token) {
  const res = await fetch(`${API_BASE}/campaigns/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchTargets() {
  const res = await fetch(`${API_BASE}/targets`);
  return res.json();
}

export async function updateTargets(id, data, token) {
  const res = await fetch(`${API_BASE}/targets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function calculateImpact(data) {
  const res = await fetch(`${API_BASE}/impact/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function generateReportData(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/reports/generate?${query}`);
  return res.json();
}

export async function submitPledge(data) {
  const res = await fetch(`${API_BASE}/pledges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchPledgesStats() {
  const res = await fetch(`${API_BASE}/pledges/stats`);
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function uploadFieldworkCsv(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/import/csv`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  return res.json();
}

export async function resetDataset(token) {
  const res = await fetch(`${API_BASE}/dataset/reset`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
