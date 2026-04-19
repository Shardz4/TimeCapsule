import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import CreateCapsule from './CreateCapsule';

function App() {
  return (
    <Router>
      <header className="fixed top-0 w-full z-50 bg-[#0c0c1d]/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(98,0,238,0.1)]">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-[#6200EE] font-[Space_Grotesk]">TimeCapsule</Link>
            <nav className="hidden md:flex gap-6 items-center">
              <Link to="/" className="text-[#6200EE] border-b-2 border-[#6200EE] pb-1 headline-font text-sm font-medium tracking-wide">Vault</Link>
              <Link to="/" className="text-[#4af8e3]/60 hover:text-[#4af8e3] transition-colors duration-300 headline-font text-sm font-medium tracking-wide">Echoes</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/create" className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-bold py-2.5 px-6 rounded-full shadow-[0_0_20px_rgba(188,135,254,0.3)] hover:scale-95 duration-200 ease-in-out flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Create New Capsule
            </Link>
            <div className="hidden md:flex items-center text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer">
              <span className="material-symbols-outlined text-3xl">account_circle</span>
            </div>
          </div>
        </div>
      </header>

      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[120px] pointer-events-none rounded-full z-[-1]"></div>
      <div className="fixed bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-secondary/5 blur-[150px] pointer-events-none rounded-full z-[-1]"></div>

      <main className="pt-32 px-6 max-w-7xl mx-auto relative z-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCapsule />} />
        </Routes>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#0c0c1d]/40 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-3xl">
        <Link to="/" className="flex flex-col items-center justify-center bg-[#6200EE]/20 text-[#4af8e3] rounded-full p-3 shadow-[0_0_15px_rgba(74,248,227,0.3)] scale-90 transition-all">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>inventory_2</span>
          <span className="text-[10px] font-bold uppercase tracking-widest font-[Manrope] mt-1">Vault</span>
        </Link>
        <Link to="/map" className="flex flex-col items-center justify-center text-white/40 p-2 hover:bg-white/5 transition-all">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-bold uppercase tracking-widest font-[Manrope] mt-1">Map</span>
        </Link>
        <Link to="/create" className="flex flex-col items-center justify-center text-white/40 p-2 hover:bg-white/5 transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-[10px] font-bold uppercase tracking-widest font-[Manrope] mt-1">Create</span>
        </Link>
      </nav>
    </Router>
  );
}

export default App;
