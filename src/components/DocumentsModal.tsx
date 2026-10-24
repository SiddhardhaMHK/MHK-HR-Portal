import React, { useState } from 'react';
import { EmployeeDocument } from '../types';
import { useToast } from './Toast';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: EmployeeDocument[];
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({
  isOpen,
  onClose,
  documents,
}) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState<EmployeeDocument | null>(null);
  const [signedDocs, setSignedDocs] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const categories = ['All', 'Legal & Offer', 'Insurance & Benefits', 'Policies & Tax'];

  const filtered = documents.filter((doc) => {
    const matchCat = filter === 'All' || doc.category === filter;
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (docName: string) => {
    const fakeContent = `MHK SOFTWARE PRIVATE LIMITED & MHK TECH INC.\nOFFICIAL SECURE ENTERPRISE DOCUMENT\nDocument: ${docName}\nClassification: Confidential / HR-Restricted\nTimestamp: ${new Date().toISOString()}\nVerified by SHA-256 Vault Signature.`;
    const blob = new Blob([fakeContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${docName.replace(/\s+/g, '_')}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded verified file: "${docName}"`, 'success', 'File Downloaded');
  };

  const handleSignDocument = (docId: string, docName: string) => {
    setSignedDocs((prev) => ({ ...prev, [docId]: true }));
    showToast(`Digitally signed "${docName}" with timestamp & cryptographic hash.`, 'success', 'Document Signed');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">folder_shared</span>
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Corporate Document Vault</h2>
                <p className="text-xs text-slate-400">
                  Official employment agreements, tax forms, medical insurance, and compliance dossiers
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-3.5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    filter === cat
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[16px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="w-full h-8 pl-8 pr-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Documents List */}
          <div className="p-4 overflow-y-auto space-y-2.5 text-xs flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-slate-400">No documents match your filter.</div>
            ) : (
              filtered.map((doc) => {
                const isSigned = signedDocs[doc.id];
                return (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs truncate">{doc.name}</span>
                          {isSigned && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              ✓ Signed
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-purple-700">{doc.category}</span> • {doc.date} • {doc.size}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors font-semibold text-xs cursor-pointer shadow-2xs"
                      >
                        Preview &amp; Sign
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(doc.name)}
                        className="p-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white shadow-xs transition-colors cursor-pointer"
                        title="Download Verified Copy"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Security Notice & Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
              <span>AES-256 Bit Encrypted • Verified against IRS &amp; DOL records</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white font-semibold cursor-pointer"
            >
              Close Vault
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Document Previewer Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-purple-400">description</span>
                <div>
                  <h3 className="font-bold text-sm truncate">{previewDoc.name}</h3>
                  <span className="text-[10px] text-slate-400">{previewDoc.category} • Certified Copy</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-100/50 space-y-4 text-xs font-serif leading-relaxed text-slate-800">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 font-sans">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">MHK Software Private Limited</span>
                    <p className="text-[11px] text-slate-500">Corporate Human Resources Compliance Dossier</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-mono font-bold text-[10px]">
                    DOC-VERIFIED
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <p>
                    <strong>Subject:</strong> {previewDoc.name}
                  </p>
                  <p>
                    <strong>Employee:</strong> Alex Kumar (MHK-HYD-0412) | Sr. Software Engineer
                  </p>
                  <p>
                    <strong>Effective Jurisdiction:</strong> Hyderabad Hub (India) &amp; Texas HQ (USA)
                  </p>
                  <hr className="my-2 border-slate-100" />
                  <p className="text-slate-600 leading-normal">
                    This document certifies employee rights, benefits coverage, statutory contributions, and standard code of professional conduct. All terms are governed by the bilateral US-India corporate talent framework, ensuring full conformity with US DOL regulations, Form I-9, and Indian labor statutes.
                  </p>
                </div>

                {signedDocs[previewDoc.id] ? (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600">verified</span>
                      <span>Digitally acknowledged and signed by Alex Kumar</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">Timestamp: 2026-10-24 09:30 IST</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-between text-xs">
                    <span className="text-purple-800 font-medium">Acknowledgement required for HR file.</span>
                    <button
                      type="button"
                      onClick={() => handleSignDocument(previewDoc.id, previewDoc.name)}
                      className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer transition-colors"
                    >
                      Digitally Sign
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => handleDownload(previewDoc.name)}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
