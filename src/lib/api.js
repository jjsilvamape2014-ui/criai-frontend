const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.error || 'Erro na requisição');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  // Auth
  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Generation
  async generateImage(prompt, options = {}) {
    return this.request('/generate/image', {
      method: 'POST',
      body: JSON.stringify({ prompt, ...options }),
    });
  }

  async generateVideo(imageUrl, options = {}) {
    return this.request('/generate/video', {
      method: 'POST',
      body: JSON.stringify({ imageUrl, ...options }),
    });
  }

  async getHistory() {
    return this.request('/generate/history');
  }

  // Credits
  async getCreditPackages() {
    return this.request('/credits/packages');
  }

  async getBalance() {
    return this.request('/credits/balance');
  }

  // Payment
  async createCheckoutSession(type, packageId) {
    return this.request('/payment/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ type, packageId }),
    });
  }

  async confirmPayment(sessionId) {
    return this.request('/payment/confirm', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  async getRecentSession() {
    return this.request('/payment/recent');
  }

  // Cérebro Visual (chat de edição de imagem)
  async cerebroChat(message, options = {}) {
    return this.request('/cerebro/chat', {
      method: 'POST',
      body: JSON.stringify({ message, ...options }),
    });
  }

  async cerebroMemory(sessionId) {
    return this.request(`/cerebro/memoria/${sessionId}`);
  }

  async cerebroReset(sessionId) {
    return this.request(`/cerebro/reset/${sessionId}`, { method: 'POST' });
  }

  async cerebroSessions() {
    return this.request('/cerebro/sessions');
  }
}

export const api = new ApiClient();
