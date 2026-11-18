"use client";

import { useState } from "react";
import { Plus, Database, CloudOff, Cloud, RefreshCw, X, Info } from "lucide-react";

interface TopbarProps {
  title: string;
  onAddTransaction?: () => void;
  isCloudMode?: boolean;
  onResetData?: () => void;
}

export default function Topbar({ title, onAddTransaction, isCloudMode = false, onResetData }: TopbarProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1F2A3D] bg-[#0A0D14]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-[#F9FAFB]">{title}</h1>
          <button
            onClick={() => setShowStatusModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
              isCloudMode
                ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25 hover:bg-[#10B981]/20"
                : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25 hover:bg-[#F59E0B]/20"
            }`}
            title="Click to view connection status"
          >
            {isCloudMode ? (
              <>
                <Cloud className="w-3 h-3" />
                <span>Cloud Synced</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3 h-3" />
                <span>Local / Demo Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {onResetData && (
            <button
              onClick={onResetData}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#9CA3AF] hover:text-white bg-[#111827] border border-[#1F2A3D] hover:border-[#374151] transition-all"
              title="Reset sample financial data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          )}

          {onAddTransaction && (
            <button
              id="add-transaction-btn"
              onClick={onAddTransaction}
              className="flex items-center gap-2 bg-[#4C6EF5] hover:bg-[#6B8AF7] text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#4C6EF530]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          )}
        </div>
      </header>

      {/* Connection Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-enter">
          <div className="bg-[#111827] border border-[#1F2A3D] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isCloudMode ? "bg-[#10B981]/20 text-[#10B981]" : "bg-[#F59E0B]/20 text-[#F59E0B]"
                }`}
              >
                {isCloudMode ? <Cloud className="w-5 h-5" /> : <Database className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {isCloudMode ? "Connected to Supabase" : "Running in Local Mode"}
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  {isCloudMode ? "Live Cloud Synchronization" : "Offline / Demo Persistence Active"}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#9CA3AF]">
              {!isCloudMode ? (
                <>
                  <div className="p-3 rounded-xl bg-[#0A0D14] border border-[#1F2A3D] text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[#F9FAFB] font-medium">
                      <span>Status:</span>
                      <span className="text-[#F59E0B]">Offline / Paused Supabase</span>
                    </div>
                    <div className="flex items-center justify-between text-[#6B7280]">
                      <span>Storage:</span>
                      <span className="text-[#9CA3AF]">Browser LocalStorage</span>
                    </div>
                  </div>
                  <p className="leading-relaxed">
                    Your Supabase project (<code className="text-[#F9FAFB] bg-[#1F2A3D] px-1 py-0.5 rounded">tjknxpafptiqreknaywn</code>) is currently paused or unreachable.
                  </p>
                  <p className="leading-relaxed">
                    FinTrack has automatically switched to <strong>Local Storage Mode</strong> so you can create, edit, delete, and analyze transactions with zero errors and instant updates.
                  </p>
                  <div className="p-3 bg-[#4C6EF5]/10 border border-[#4C6EF5]/20 rounded-xl text-xs text-[#E0E7FF] flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#4C6EF5] flex-shrink-0 mt-0.5" />
                    <span>
                      To sync to the cloud, log in to <strong>supabase.com</strong>, find your project, and click <strong>&quot;Resume Project&quot;</strong>.
                    </span>
                  </div>
                </>
              ) : (
                <p className="leading-relaxed">
                  Your app is securely connected to Supabase PostgreSQL with Row-Level Security enabled. All your actions are saved in the cloud.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {onResetData && (
                <button
                  onClick={() => {
                    onResetData();
                    setShowStatusModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1F2A3D] text-white hover:bg-[#374151] transition-colors"
                >
                  Reload Sample Data
                </button>
              )}
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#4C6EF5] text-white hover:bg-[#6B8AF7] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
