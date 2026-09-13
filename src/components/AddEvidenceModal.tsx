import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EvidenceType, VerificationStatus } from '../types';
import {
  X,
  UploadCloud,
  FileVideo,
  FileAudio,
  FileImage,
  FolderGit2,
  FileCheck2,
  Award,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({ isOpen, onClose }) => {
  const { addEvidence } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EvidenceType>('Video');
  const [description, setDescription] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('Evidence-backed');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const typeOptions: { type: EvidenceType; icon: any; label: string }[] = [
    { type: 'Video', icon: FileVideo, label: 'Video (Performance/Demo)' },
    { type: 'Audio', icon: FileAudio, label: 'Audio (Track/Recording)' },
    { type: 'Image', icon: FileImage, label: 'Image (Artwork/Visuals)' },
    { type: 'Project', icon: FolderGit2, label: 'Project (Code/Product)' },
    { type: 'Certificate', icon: FileCheck2, label: 'Certificate (Credential)' },
    { type: 'Achievement', icon: Award, label: 'Achievement (Award/Honor)' },
    { type: 'External portfolio', icon: Globe, label: 'External Portfolio (URL)' },
  ];

  const verificationOptions: { status: VerificationStatus; label: string; desc: string }[] = [
    { status: 'Evidence-backed', label: 'Evidence-backed', desc: 'Direct media, source artifact or recording provided' },
    { status: 'Institution verified', label: 'Institution verified', desc: 'Has official credential ID or university/festival sign-off' },
    { status: 'Mentor verified', label: 'Mentor verified', desc: 'Verified by a qualified teacher or industry coach' },
    { status: 'Community recognition', label: 'Community recognition', desc: 'Recognized public performance or peer acclaim' },
    { status: 'Self-declared', label: 'Self-declared', desc: 'Awaiting independent verification' },
  ];

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a descriptive title for this evidence artifact.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description of what this evidence demonstrates.');
      return;
    }

    addEvidence({
      title: title.trim(),
      type,
      description: description.trim(),
      verificationStatus,
      url: url.trim() || undefined,
      fileMeta: fileName ? `${fileName} • Uploaded & Indexed` : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Add Evidence Artifact
            </h3>
            <p className="text-xs text-slate-500">
              Provide verifiable proof to raise your Talent Passport confidence score.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Artifact Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Evidence Type
            </label>
            <select
              id="add-evidence-type-select"
              value={type}
              onChange={(e) => setType(e.target.value as EvidenceType)}
              className="w-full text-sm rounded-lg border border-slate-300 py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {typeOptions.map(opt => (
                <option key={opt.type} value={opt.type}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="add-evidence-title-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Title of Evidence
            </label>
            <input
              id="add-evidence-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Carnatic Solo Performance at State Youth Fest"
              className="w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Mock File Upload / URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload Artifact or Recording
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-4 text-center bg-slate-50 transition-colors">
              <input
                type="file"
                id="add-evidence-file-input"
                onChange={handleSimulatedFileUpload}
                className="hidden"
              />
              <label
                htmlFor="add-evidence-file-input"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <UploadCloud className="w-8 h-8 text-sky-600 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  {fileName ? fileName : 'Click to select file or drag and drop'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  MP4, WAV, MP3, PDF, PNG or ZIP up to 50MB
                </span>
              </label>

              {isUploading && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {uploadProgress === 100 && (
                <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Upload complete & cryptographic hash indexed</span>
                </div>
              )}
            </div>
          </div>

          {/* External URL */}
          <div>
            <label htmlFor="add-evidence-url-input" className="block text-xs font-semibold text-slate-700 mb-1">
              External Link / Repository (Optional)
            </label>
            <input
              id="add-evidence-url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/... or https://github.com/..."
              className="w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="add-evidence-description-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Context & What This Proves
            </label>
            <textarea
              id="add-evidence-description-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your specific contribution, techniques used, and outcomes achieved..."
              className="w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            ></textarea>
          </div>

          {/* Verification Status Tier */}
          <div>
            <label htmlFor="add-evidence-status-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Verification Tier
            </label>
            <select
              id="add-evidence-status-select"
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
              className="w-full text-sm rounded-lg border border-slate-300 py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {verificationOptions.map(opt => (
                <option key={opt.status} value={opt.status}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              id="add-evidence-cancel-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="add-evidence-submit-btn"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              Save to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
