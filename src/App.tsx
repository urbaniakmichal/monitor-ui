import { useEffect, useState } from 'react';
import { agentApi, type HealthResponse, type MetricsResponse } from './services/api';

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setError(null);
      const [healthData, metricsData] = await Promise.all([
        agentApi.getHealth(),
        agentApi.getMetrics(),
      ]);
      setHealth(healthData);
      setMetrics(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      await agentApi.startAgent();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się uruchomić agenta');
    }
  };

  const handleStop = async () => {
    try {
      await agentApi.stopAgent();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zatrzymać agenta');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Ładowanie danych z agenta...</div>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Monitor Agent Dashboard</h1>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1rem' }}>
          <strong>Błąd:</strong> {error}
        </div>
      )}

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2>Status Agenta</h2>
        <p>Stan: <strong style={{ color: health?.status === 'running' ? '#16a34a' : '#dc2626' }}>{health?.status || 'Nieznany'}</strong></p>
        <p>Czas działania: {health?.uptime || 'N/A'}</p>
        <p>Wersja: {health?.version || 'N/A'}</p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={handleStart}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Uruchom Agenta
          </button>
          <button
            onClick={handleStop}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Zatrzymaj Agenta
          </button>
        </div>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem' }}>
        <h2>Podgląd Metryk</h2>
        <p>Aktualizacja: {metrics?.timestamp ? new Date(metrics.timestamp).toLocaleTimeString() : 'Brak'}</p>
        <pre style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '6px', overflowX: 'auto', fontSize: '0.85rem' }}>
          {JSON.stringify(metrics?.data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;