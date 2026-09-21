import React, { useRef } from 'react';
import { X, Download, Upload, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DataExportModal = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onReset
}) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImport(event.target.result);
        onClose();
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border-slate-700/80 shadow-2xl overflow-hidden p-6 space-y-6 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Backup & Restore Progress</h3>
              <p className="text-xs text-slate-400">Save your progress offline or transfer to another browser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Options */}
        <div className="space-y-4">
          
          {/* Export JSON */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white">Export Progress JSON</h4>
              <p className="text-xs text-slate-400 mt-0.5">Download a complete backup file of your solved problems & streak.</p>
            </div>
            <button
              onClick={onExport}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl flex items-center space-x-1.5 transition-colors shadow-lg shadow-emerald-600/20 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white">Import Progress JSON</h4>
              <p className="text-xs text-slate-400 mt-0.5">Upload a previously exported `.json` backup file.</p>
            </div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center space-x-1.5 transition-colors shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
          </div>

          {/* Reset All */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-rose-300 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Reset All Data</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Clear all solved checkboxes, notes, and streak counters.</p>
            </div>
            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-xl flex items-center space-x-1.5 transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
