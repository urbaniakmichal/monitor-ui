import type { components } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export type HealthResponse = components['schemas']['internal_api.HealthResponse'];
export type MetricsResponse = components['schemas']['internal_api.MetricsResponse'];
export type AgentActionResponse = components['schemas']['internal_api.AgentActionResponse'];

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.Message ||
      errorData.message ||
      `HTTP Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return response.json();
}

export const agentApi = {
  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<HealthResponse>(response);
  },

  async startAgent(): Promise<AgentActionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/agent/start`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<AgentActionResponse>(response);
  },

  async stopAgent(): Promise<AgentActionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/agent/stop`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<AgentActionResponse>(response);
  },

  async getMetrics(): Promise<MetricsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/agent/metrics`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<MetricsResponse>(response);
  },
};