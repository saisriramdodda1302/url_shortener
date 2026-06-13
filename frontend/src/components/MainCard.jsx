import React, { useState } from 'react';
import { Copy, Link, Check, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function MainCard() {
    const [longUrl, setLongUrl] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!longUrl) return;
        setLoading(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${apiUrl}/api/v1/shorten`, { longUrl });
            
            if (res.data.shortKey) {
                const generatedLink = `${apiUrl}/${res.data.shortKey}`;
                setHistory([{ original: longUrl, shortened: generatedLink }, ...history]);
                setLongUrl('');
            }
        } catch (err) {
            console.error("Networking error: ", err);
            setError(err.response?.data?.error || 'Failed to shorten URL. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (url, index) => {
        navigator.clipboard.writeText(url);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto mt-24 px-4 w-full">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                    Minimalist <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Link Shortener</span>
                </h1>
                <p className="text-neutral-400 max-w-xl mx-auto">
                    Fast and reliable.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-[#111111] border border-neutral-800 shadow-xl focus-within:border-neutral-500 transition-colors duration-200">
                <div className="flex-1 flex items-center px-4">
                    <Link className="w-5 h-5 text-neutral-500 mr-3" />
                    <input 
                        type="url" 
                        required 
                        value={longUrl} 
                        onChange={(e) => setLongUrl(e.target.value)}
                        placeholder="Paste your long destination link here..." 
                        className="w-full py-4 text-white placeholder-neutral-500 bg-transparent focus:outline-none text-lg"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex items-center justify-center px-8 py-4 font-semibold text-black bg-white rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Shorten
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-200 text-sm text-center">
                    {error}
                </div>
            )}

            {history.length > 0 && (
                <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-sm font-medium tracking-wider text-neutral-400 uppercase">Recent Links</h3>
                        <span className="text-xs text-neutral-500">{history.length} generated</span>
                    </div>
                    
                    <div className="overflow-hidden border border-neutral-800 bg-[#111111] rounded-2xl shadow-lg divider-y">
                        {history.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-[#161616] transition-colors gap-4">
                                <div className="truncate flex-1 pr-4">
                                    <p className="text-sm text-neutral-500 truncate mb-1" title={item.original}>
                                        {item.original}
                                    </p>
                                    <a 
                                        href={item.shortened} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="text-base font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                                    >
                                        {item.shortened}
                                    </a>
                                </div>
                                <button 
                                    onClick={() => handleCopy(item.shortened, index)} 
                                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-w-[100px] ${
                                        copiedIndex === index 
                                        ? 'bg-green-950/30 text-green-400 border border-green-900/50' 
                                        : 'bg-transparent text-neutral-300 border border-neutral-700 hover:bg-neutral-800 hover:text-white hover:border-neutral-600'
                                    }`}
                                >
                                    {copiedIndex === index ? (
                                        <><Check className="w-4 h-4" /> Copied</>
                                    ) : (
                                        <><Copy className="w-4 h-4" /> Copy</>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
