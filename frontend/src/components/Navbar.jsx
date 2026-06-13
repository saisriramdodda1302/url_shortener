import React from 'react';
import { Link2 } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-1.5 rounded-lg">
                            <Link2 className="w-5 h-5 text-black" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">URL.short</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a 
                            href="https://github.com/saisriramdodda1302/url_shortener" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
