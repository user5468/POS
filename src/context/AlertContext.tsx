import { createContext, useContext, useState, ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Alert {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (type: AlertType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  showError: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (type: AlertType, message: string) => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 3000);
  };

  const success = (message: string) => showAlert('success', message);
  const error = (message: string) => showAlert('error', message);
  const showError = (message: string) => showAlert('error', message);
  const warning = (message: string) => showAlert('warning', message);
  const info = (message: string) => showAlert('info', message);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, success, error, showError, warning, info }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
              alert.type === 'success' ? 'bg-gray-900' :
              alert.type === 'error' ? 'bg-red-600' :
              alert.type === 'warning' ? 'bg-orange-600' :
              'bg-blue-600'
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
}
