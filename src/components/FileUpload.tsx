
import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.epub')) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('请选择EPUB格式的电子书文件');
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.epub')) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('请选择EPUB格式的电子书文件');
      }
    }
  }, [onFileSelect]);

  const clearFile = () => {
    setSelectedFile(null);
  };

  if (selectedFile && !isProcessing) {
    return (
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
        <div className="flex items-center justify-center space-x-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <span className="text-lg font-medium text-blue-800">{selectedFile.name}</span>
          <button
            onClick={clearFile}
            className="p-1 hover:bg-blue-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-blue-600" />
          </button>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          文件大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
        dragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        上传EPUB电子书
      </h3>
      <p className="text-gray-500 mb-4">
        拖拽文件到这里，或点击选择文件
      </p>
      <input
        type="file"
        accept=".epub"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
        disabled={isProcessing}
      />
      <label
        htmlFor="file-upload"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
      >
        选择文件
      </label>
      <p className="text-xs text-gray-400 mt-3">
        支持格式：EPUB
      </p>
    </div>
  );
};

export default FileUpload;
