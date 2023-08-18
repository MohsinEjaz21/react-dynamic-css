import App from '@src/App';
import ReactDOM from 'react-dom/client';

import '@/src/main.scss';

import { enableReactUse } from '@legendapp/state/config/enableReactUse';
enableReactUse()

ReactDOM.createRoot(document.getElementById('root') as any).render(
  <App />
);
