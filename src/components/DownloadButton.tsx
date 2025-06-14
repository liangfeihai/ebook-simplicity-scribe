
import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  processedFile: Blob | null;
  originalFileName: string;
  onDownload: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  processedFile, 
  originalFileName, 
  onDownload 
}) => {
  if (!processedFile) return null;

  const handleDownload = () => {
    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalFileName.replace('.epub', '_简体.epub');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          转换完成！
        </h3>
        <button
          onClick={handleDownload}
          className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>下载简体版本</span>
        </button>
        <p className="text-xs text-gray-500 mt-3">
          文件名：{originalFileName.replace('.epub', '_简体.epub')}
        </p>
      </div>
    </div>
  );
};

export default DownloadButton;
