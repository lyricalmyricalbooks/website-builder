'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';

// Import GrapesJS Studio SDK styles
import '@grapesjs/studio-sdk/style';

// Dynamically import StudioEditor to prevent Next.js SSR (Server-Side Rendering) errors,
// since GrapesJS relies heavily on browser-specific APIs (window, document, etc.)
const StudioEditor = dynamic(
  async () => {
    const mod = await import('@grapesjs/studio-sdk/react');
    return mod.default || mod.StudioEditor;
  },
  { ssr: false }
);

export default function StudioPage() {
  const [projectId, setProjectId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Generate stable unique IDs for project and user on the client side
    let storedProjectId = localStorage.getItem('grapesjs_project_id');
    let storedUserId = localStorage.getItem('grapesjs_user_id');

    if (!storedProjectId) {
      storedProjectId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `proj_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('grapesjs_project_id', storedProjectId);
    }

    if (!storedUserId) {
      storedUserId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `user_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('grapesjs_user_id', storedUserId);
    }

    setProjectId(storedProjectId);
    setUserId(storedUserId);
  }, []);

  if (!projectId || !userId) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-sm font-medium">Initializing Studio SDK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden">
      {/* Floating Back button */}
      <div className="absolute bottom-6 right-6 z-[9999]">
        <Link
          href="/"
          className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl shadow-2xl flex items-center space-x-2 text-sm font-semibold transition-all hover:scale-105 backdrop-blur-sm"
        >
          <ArrowLeft size={15} />
          <span>Back to Storefront</span>
        </Link>
      </div>

      {/* GrapesJS Studio Editor */}
      <div className="w-full h-full">
        <StudioEditor
          options={{
            licenseKey: '1c617fad02c64888959e41900866752268b70b7b8cd447cd8ca030fb5064bdd6',
            project: {
              type: 'web',
              id: projectId,
            },
            identity: {
              id: userId,
            },
            assets: {
              storageType: 'cloud',
            },
            storage: {
              type: 'cloud',
              autosaveChanges: 1000,
              autosaveIntervalMs: 10000,
            },
          }}
        />
      </div>
    </div>
  );
}
