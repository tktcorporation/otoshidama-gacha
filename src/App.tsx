import { GachaForm, GachaResult } from '@/components/OtoshidamaGacha';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="w-screen h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<GachaForm />} />
          <Route path="/result/:playerName" element={<GachaResult />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;