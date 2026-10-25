import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'system-ui, sans-serif'
});

export default function UMLViewer({ diagramCode, id, title }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const [svgHtml, setSvgHtml] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        setError(null);
        const uniqueId = 'mermaid-' + id + '-' + Math.random().toString(36).substring(2, 7);
        const { svg } = await mermaid.render(uniqueId, diagramCode);
        if (isMounted) {
          setSvgHtml(svg);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setError(err.message || 'Diagram rendering failed');
        }
      }
    };

    if (diagramCode) {
      renderDiagram();
    }

    return () => {
      isMounted = false;
    };
  }, [diagramCode, id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(diagramCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span className="text-xs font-bold text-slate-800">{title || 'UML Diagram'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.15, 2.5))}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200/60 rounded-md transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.5))}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200/60 rounded-md transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200/60 rounded-md transition"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-500 px-1.5">{Math.round(zoom * 100)}%</span>

          <div className="h-4 w-px bg-slate-300 mx-1"></div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 bg-slate-50/50 overflow-auto min-h-[380px] flex items-center justify-center">
        {error ? (
          <div className="p-4 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 max-w-md">
            <p className="font-bold mb-1">Diagram Rendering Error:</p>
            <pre className="whitespace-pre-wrap font-mono text-[11px]">{error}</pre>
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
            className="max-w-full flex justify-center"
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        )}
      </div>
    </div>
  );
}
