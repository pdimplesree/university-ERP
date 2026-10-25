import React, { useState, useEffect } from 'react';
import UMLViewer from '../components/UMLViewer';
import {
  Layers,
  BookOpen,
  Award,
  CheckCircle2,
  FileCode,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function UMLHubPage() {
  const [umlData, setUmlData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('usecase');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/uml/data')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUmlData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !umlData) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        Loading UML Models and Architecture Hub...
      </div>
    );
  }

  const activeSection = umlData.sections?.find(s => s.id === selectedSection) || umlData.sections[0];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded border border-amber-500/30">
              OOAD USING UML ARCHITECTURE
            </span>
            <span className="text-xs text-slate-300 font-mono">ADITYA UNIVERSITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            System Design & UML Models Explorer
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Interactive visualization of all 7 diagrams from the Aditya University presentation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-amber-300 font-semibold">
            BCE Architecture
          </span>
          <span className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-blue-300 font-semibold">
            UML 2.5 Standard
          </span>
        </div>
      </div>

      {/* Diagram Selection Tabs */}
      <div className="flex overflow-x-auto bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-1 scrollbar-none border border-slate-200">
        {umlData.sections?.map(sec => (
          <button
            key={sec.id}
            onClick={() => setSelectedSection(sec.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl transition ${
              selectedSection === sec.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Diagram Render Container */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase">
              Presentation Slide {activeSection.slide}
            </span>
            <h2 className="text-lg font-bold text-slate-900">{activeSection.title}</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">{activeSection.description}</p>
          </div>
        </div>

        {/* Interactive Mermaid Canvas */}
        <UMLViewer
          diagramCode={activeSection.mermaid}
          id={activeSection.id}
          title={activeSection.title}
        />

        {/* Specifications & Notes */}
        {activeSection.specifications && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Use Case Specifications Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">Use Case</th>
                    <th className="p-3">Primary Actor</th>
                    <th className="p-3">Trigger Condition</th>
                    <th className="p-3">Pre-Condition</th>
                    <th className="p-3">Post-Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeSection.specifications.map((sp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-blue-950">{sp.useCase}</td>
                      <td className="p-3 font-medium text-slate-700">{sp.actor}</td>
                      <td className="p-3 text-slate-600">{sp.trigger}</td>
                      <td className="p-3 text-slate-600">{sp.preCondition}</td>
                      <td className="p-3 text-slate-600 font-semibold text-emerald-800">{sp.postCondition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection.notes && (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <strong className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Object-Oriented Design Insight:
            </strong>
            <p className="text-amber-800 text-[11px] leading-relaxed">{activeSection.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
