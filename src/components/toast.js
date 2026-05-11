export const toast = {
  success: (msg) => window._toast?.(msg, 'success') || alert(msg),
  error: (msg) => window._toast?.(msg, 'error') || alert(msg),
  loading: (msg) => window._toast?.(msg, 'loading')
};

export const Toast = () => {
  const [, update] = useState(0);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    window._toast = (msg, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
  }, []);

  return html`
    <div class="fixed top-4 right-4 z-50 space-y-2">
      ${toasts.map(t => html`
        <div class="px-4 py-3 rounded-lg shadow-lg text-white animate-slide-up ${
          t.type === 'success' ? 'bg-green-500' : 
          t.type === 'error' ? 'bg-red-500' : 
          'bg-blue-500'}">
          ${t.msg}
        </div>
      `)}
    </div>
  `;
};
