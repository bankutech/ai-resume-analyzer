import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResumeDocument, SAMPLE_STUDENT_RESUME_DOCUMENT } from '@resumeforge/shared';
import { TemplateRenderer } from '../../components/templates/TemplateRenderer';

export const ResumePrintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<ResumeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/resumes/print-payload/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.resume?.document) {
          setDoc(data.resume.document);
        } else {
          setDoc(SAMPLE_STUDENT_RESUME_DOCUMENT);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setFontsLoaded(true));
    } else {
      setFontsLoaded(true);
    }
  }, []);

  if (loading || !fontsLoaded) {
    return (
      <div className="p-8 font-mono text-xs text-gray-500">
        Preparing document for vector print (loading fonts and layout)...
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="p-8 font-mono text-xs text-red-600">
        Error loading document for print: {error}
      </div>
    );
  }

  const { pageSize = 'A4', marginPreset = 'normal', fontFamily = 'Inter' } = doc.metadata || {};

  const isA4 = pageSize === 'A4';
  const pageWidth = isA4 ? '210mm' : '8.5in';
  const pageMinHeight = isA4 ? '297mm' : '11in';

  const paddingMap = {
    narrow: 'p-6',
    normal: 'p-10',
    wide: 'p-14',
  };
  const paddingClass = paddingMap[marginPreset as keyof typeof paddingMap] || 'p-10';

  const fontClassMap = {
    'Inter': 'font-sans',
    'Roboto': 'font-sans',
    'Source Serif 4': 'font-serif',
    'Merriweather': 'font-serif',
    'JetBrains Mono': 'font-mono',
  };
  const fontClass = fontClassMap[fontFamily as keyof typeof fontClassMap] || 'font-sans';

  return (
    <>
      <style>{`
        @page {
          size: ${isA4 ? 'A4' : 'letter'};
          margin: 0;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }
          #print-root {
            box-shadow: none !important;
            filter: none !important;
            transform: none !important;
            width: 100% !important;
          }
        }
      `}</style>
      <div
        id="print-root"
        data-ready="true"
        className="bg-white text-gray-900 min-h-screen"
        style={{ margin: 0, padding: 0 }}
      >
        <div
          className={`mx-auto bg-white ${paddingClass} ${fontClass}`}
          style={{
            width: pageWidth,
            minHeight: pageMinHeight,
            boxSizing: 'border-box',
          }}
        >
          <TemplateRenderer document={doc} />
        </div>
      </div>
    </>
  );
};
