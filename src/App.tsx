import {
  useGetApiV1AgentMetrics,
  useGetApiV1Health,
  usePostApiV1AgentStart,
  usePostApiV1AgentStop
} from './api/api';
import type { InternalApiMetricsResponse } from './api/models';
import { InfoCard } from './components/InfoCard';

export default function App() {
  const { data: healthData } = useGetApiV1Health({
    query: {
      refetchInterval: 5000,
      refetchOnWindowFocus: false,
    },
  });

  const health = healthData?.data;
  const isRunning = health?.status === 'running' || health?.status === 'Running';

  const { data: metricsData, isLoading, error, refetch } = useGetApiV1AgentMetrics({
    query: {
      refetchInterval: isRunning ? 3000 : false,
      refetchOnWindowFocus: false,
    },
  });

  const startMutation = usePostApiV1AgentStart({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const stopMutation = usePostApiV1AgentStop({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-slate-600 font-medium">Synchronizing with server...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-red-500 font-medium">API Connection Error (verify if the Go backend is running)</div>
      </div>
    );
  }

  const response = metricsData?.data as InternalApiMetricsResponse;
  const metricsList = response?.data;
  const latestMetrics = metricsList && metricsList.length > 0 ? metricsList[metricsList.length - 1] : null;

const handleDownload = async () => {
    try {
      const res = await fetch('/api/v1/agent/file');
      if (!res.ok) throw new Error('Network response was not ok');

      const blob = await res.blob();

      const disposition = res.headers.get('content-disposition');
      let filename = 'report.json'; // domyślny fallback

      if (disposition && disposition.includes('attachment')) {
        const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">System Dashboard</h1>
            <p className="text-sm text-slate-500">Monitor Agent API</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
              Status: <span className={`font-bold ${isRunning ? 'text-emerald-600' : 'text-rose-600'}`}>
                {health?.status || 'Unknown'}
              </span>
            </div>

            <button
              onClick={() => startMutation.mutate()}
              disabled={startMutation.isPending || isRunning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {startMutation.isPending ? 'Starting...' : 'Start Agent'}
            </button>

            <button
              onClick={() => stopMutation.mutate()}
              disabled={stopMutation.isPending || !isRunning}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {stopMutation.isPending ? 'Stopping...' : 'Stop Agent'}
            </button>

            <button
              onClick={handleDownload}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition cursor-pointer"
            >
              Download Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard title="System Info" data={latestMetrics?.system} />
          <InfoCard title="Hardware" data={latestMetrics?.hardware} />
          <InfoCard title="Software" data={latestMetrics?.software} />
        </div>
      </div>
    </div>
  );
}