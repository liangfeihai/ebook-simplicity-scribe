
import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ProcessingProgressProps {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({ status, progress, message }) => {
  if (status === 'idle') return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        {status === 'processing' && (
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        )}
        {status === 'completed' && (
          <CheckCircle className="w-6 h-6 text-green-600" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-6 h-6 text-red-600" />
        )}
        <h3 className="text-lg font-semibold text-gray-800">
          {status === 'processing' && '正在处理...'}
          {status === 'completed' && '转换完成'}
          {status === 'error' && '处理出错'}
        </h3>
      </div>
      
      {status === 'processing' && (
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{message}</p>
          <p className="text-xs text-gray-500">{progress.toFixed(1)}% 完成</p>
        </div>
      )}
      
      {status === 'completed' && (
        <p className="text-green-700 text-sm">{message}</p>
      )}
      
      {status === 'error' && (
        <p className="text-red-700 text-sm">{message}</p>
      )}
    </div>
  );
};

export default ProcessingProgress;
