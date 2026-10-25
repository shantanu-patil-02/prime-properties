import {createRoot} from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// Configure API base URL for separate frontend/backend hosting (e.g., Vercel frontend + Render backend)
const apiBase = import.meta.env.VITE_API_URL;
if (apiBase) {
  axios.defaults.baseURL = apiBase.replace(/\/+$/, '');
}
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(<App />);
