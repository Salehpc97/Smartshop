// api.js
class ApiService {
  constructor(userId) { this.userId = userId; }
  async fetchData(endpoint) {
    const response = await fetch(`/api/${endpoint}?userId=${this.userId}`);
    if (!response.ok) throw new Error(`Failed to fetch from ${endpoint}`);
    return response.json();
  }
  async postData(endpoint, body) {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, userId: this.userId }),
    });
    if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);
    return response.json();
  }
}
export default ApiService;
