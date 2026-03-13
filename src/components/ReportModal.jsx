import React from 'react';
import ReactMarkdown from 'react-markdown';

const ReportModal = ({ isOpen, onClose, reportContent }) => {
  if (!isOpen) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    alert("Report copied to clipboard!");
  };

  const components = {
    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3.5" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-5 mb-2.5" {...props} />,
    h4: ({node, ...props}) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
    p: ({node, ...props}) => <p className="mb-5" {...props} />,
    ul: ({node, ...props}) => <ul className="mb-5 pl-8 list-disc" {...props} />,
    ol: ({node, ...props}) => <ol className="mb-5 pl-8 list-decimal" {...props} />,
    li: ({node, ...props}) => <li className="mb-2" {...props} />,
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-600">
        <h2 className="border-b-2 border-gray-600 pb-4 mb-4 text-2xl">Generated AI Report</h2>
        <div className="whitespace-pre-wrap break-words bg-gray-900 p-6 rounded-md leading-relaxed">
          {reportContent ? (
            <ReactMarkdown components={components}>{reportContent}</ReactMarkdown>
          ) : (
            <span className="ellipsis">Generating</span>
          )}
        </div>
        <div className="flex justify-end mt-6 gap-4">
          <button onClick={handleCopy} className="px-6 py-3 rounded-md border-none bg-blue-600 text-white cursor-pointer font-bold">
            Copy to Clipboard
          </button>
          <button onClick={onClose} className="px-6 py-3 rounded-md border-none bg-red-700 text-white cursor-pointer font-bold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;