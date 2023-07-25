/*msw should be imported before others to take effect before loader calls*/
import mockService from './mocks';

import { createRoot } from 'react-dom/client';
import App from './src';

const container = document.getElementById('react-root')
const root = createRoot(container);
root.render(<App />);
