import React from 'react';
import Navbar from './components/Navbar';
import MainCard from './components/MainCard';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-white selection:text-black">
      <Navbar />
      <main className="pb-24">
        <MainCard />
      </main>
      
      <footer className="fixed bottom-0 w-full py-6 text-center text-sm text-neutral-600 border-t border-neutral-900 bg-[#0a0a0a]">
        <p>Alex Xu System Design Architecture Implementation.</p>
      </footer>
    </div>
  );
}

export default App;
