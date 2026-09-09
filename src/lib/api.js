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

  // Geração com status em tempo real ("onde a IA está pesquisando"). Consome SSE.
  // onStatus(text) é chamado a cada etapa; resolve com o resultado final (event done).
  async generateImageLive(prompt, options = {}, onStatus, onResearch) {
    const url = `${this.baseURL}/generate/live-image`;
    const token = this.getToken();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ prompt, ...options }),
    });

    const ctype = res.headers.get('content-type') || '';
    if (!res.ok && !ctype.includes('text/event-stream')) {
      const errData = await res.json().catch(() => null);
      const error = new Error(errData?.error || 'Erro na geração');
      error.status = res.status;
      error.data = errData;
      throw error;
    }
    if (!res.body) {
      const errData = await res.json().catch(() => null);
      const error = new Error(errData?.error || 'Erro na geração');
      error.data = errData;
      throw error;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let result = null;

    const parseEvents = () => {
      let idx;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const block = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        let event = 'message';
        let data = '';
        for (const line of block.split('\n')) {
          if (line.startsWith('event:')) event = line.slice(6).trim();
          else if (line.startsWith('data:')) data += line.slice(5).trim();
        }
        if (!data) continue;
        let payload = {};
        try {
          payload = JSON.parse(data);
        } catch {
          continue;
        }
        if (event === 'status' && onStatus) onStatus(payload.text || '');
        else if (event === 'research' && payload.inspiration && onResearch) onResearch(payload);
        else if (event === 'done') result = payload;
        else if (event === 'error') {
          const error = new Error(payload.error || 'Erro na geração');
          error.status = payload.code === 'NO_CREDITS' ? 403 : 500;
          error.data = payload;
          throw error;
        }
      }
    };

    while (true) {
      const { value, done: streamDone } = await reader.read();
      if (streamDone) break;
      buffer += decoder.decode(value, { stream: true });
      try {
        parseEvents();
      } catch (e) {
        throw e;
      }
      if (result) break;
    }

    if (!result) throw new Error('Stream encerrou sem resultado');
    return { ...result, research: result.research || null };
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

  // Modelos de design (Freepik)
  async freepikTemplates(q) {
    return this.request(`/templates/freepik?q=${encodeURIComponent(q)}`);
  }
}

export const api = new ApiClient();
