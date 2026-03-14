import { BrowserRouter } from 'react-router-dom';
import { AppContent } from './app-content';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
