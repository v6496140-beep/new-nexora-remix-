import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, Eye, Smartphone, Tablet, Monitor, Undo, Redo, Layout, FileText, Settings, Palette, Type } from 'lucide-react';
import { AdminShell } from '../../AdminShell';

// Mock website content
const MOCK_CONTENT = {
  hero: { heading: 'Welcome to Royal Crown', sub: 'The best barber in town' },
  about: { heading: 'Our Story', body: 'We bring excellence to grooming.' }
};

export function WebsiteEditorPage() {
  const [activeTab, setActiveTab] = useState('sections');
  const [content, setContent] = useState(MOCK_CONTENT);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b bg-white">
        <h1 className="font-bold text-lg">Website Editor</h1>
        <div className="flex gap-2">
          <button className="p-2 border rounded"><Undo className="w-4 h-4"/></button>
          <button className="p-2 border rounded"><Redo className="w-4 h-4"/></button>
          <button className="p-2 bg-indigo-600 text-white rounded">Publish</button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-slate-50 p-4 space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('pages')} className={`p-2 flex-1 rounded ${activeTab === 'pages' ? 'bg-white' : ''}`}><FileText className="w-4 h-4"/></button>
            <button onClick={() => setActiveTab('sections')} className={`p-2 flex-1 rounded ${activeTab === 'sections' ? 'bg-white' : ''}`}><Layout className="w-4 h-4"/></button>
          </div>
          <div className="space-y-2">
            {activeTab === 'sections' && ['Hero', 'About', 'Services', 'Contact'].map(section => (
              <div key={section} className="p-2 bg-white border rounded cursor-pointer">{section}</div>
            ))}
          </div>
        </aside>

        {/* Center Preview */}
        <main className="flex-1 bg-slate-100 p-4 overflow-y-auto">
            <div className="bg-white shadow-lg mx-auto w-full max-w-4xl h-full p-8">
                <h1 className="text-4xl font-bold">{content.hero.heading}</h1>
                <p className="mt-4">{content.hero.sub}</p>
            </div>
        </main>

        {/* Right Settings */}
        <aside className="w-80 border-l bg-white p-4">
            <h2 className="font-bold mb-4">Edit Hero Section</h2>
            <div className="space-y-4">
                <input className="w-full p-2 border rounded" value={content.hero.heading} onChange={e => setContent({...content, hero: {...content.hero, heading: e.target.value}})} />
                <textarea className="w-full p-2 border rounded" value={content.hero.sub} onChange={e => setContent({...content, hero: {...content.hero, sub: e.target.value}})} />
            </div>
        </aside>
      </div>
    </div>
  );
}
