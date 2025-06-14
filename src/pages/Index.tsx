
import React, { useState, useCallback } from 'react';
import { BookOpen, Zap, Shield, Download, Mail } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import ProcessingProgress from '../components/ProcessingProgress';
import DownloadButton from '../components/DownloadButton';
import { EpubConverter } from '../utils/epubConverter';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [convertedFileName, setConvertedFileName] = useState('');
  const [conversionType, setConversionType] = useState<'traditional-to-simplified' | 'simplified-to-traditional'>('traditional-to-simplified');

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setProcessingStatus('processing');
    setProgress(0);
    setProcessedFile(null);
    setConvertedFileName('');
    
    // 开始转换
    const converter = new EpubConverter(conversionType);
    
    converter.convertEpubFile(
      file,
      (progress: number, message: string) => {
        setProgress(progress);
        setProgressMessage(message);
      }
    ).then((result) => {
      setProcessedFile(result.blob);
      setConvertedFileName(result.convertedFileName);
      setProcessingStatus('completed');
      setProgressMessage('转换完成！');
    }).catch((error) => {
      console.error('转换失败:', error);
      setProcessingStatus('error');
      setProgressMessage(error.message || '转换过程中发生错误');
    });
  }, [conversionType]);

  const handleDownload = useCallback(() => {
    // 重置状态，允许用户上传新文件
    setSelectedFile(null);
    setProcessingStatus('idle');
    setProgress(0);
    setProgressMessage('');
    setProcessedFile(null);
    setConvertedFileName('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            电子书繁简转换器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            将EPUB电子书中的繁体中文转换为简体中文，或将简体中文转换为繁体中文，保持原有格式和结构不变
          </p>
        </div>

        {/* 特性介绍 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">快速转换</h3>
            <p className="text-gray-600 text-sm">
              高效的转换算法，快速处理大型电子书文件
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Shield className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">格式保持</h3>
            <p className="text-gray-600 text-sm">
              完整保持原有排版、结构和页面布局
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Download className="w-10 h-10 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">即时下载</h3>
            <p className="text-gray-600 text-sm">
              转换完成后立即下载，无需等待
            </p>
          </div>
        </div>

        {/* 主要功能区域 */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 转换类型选择 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              选择转换类型
            </h2>
            <div className="flex justify-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="conversionType"
                  value="traditional-to-simplified"
                  checked={conversionType === 'traditional-to-simplified'}
                  onChange={(e) => setConversionType(e.target.value as 'traditional-to-simplified' | 'simplified-to-traditional')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">繁体转简体</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="conversionType"
                  value="simplified-to-traditional"
                  checked={conversionType === 'simplified-to-traditional'}
                  onChange={(e) => setConversionType(e.target.value as 'traditional-to-simplified' | 'simplified-to-traditional')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">简体转繁体</span>
              </label>
            </div>
          </div>

          {/* 文件上传 */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              上传EPUB电子书
            </h2>
            <FileUpload 
              onFileSelect={handleFileSelect}
              isProcessing={processingStatus === 'processing'}
            />
          </div>

          {/* 处理进度 */}
          <ProcessingProgress
            status={processingStatus}
            progress={progress}
            message={progressMessage}
          />

          {/* 下载按钮 */}
          <DownloadButton
            processedFile={processedFile}
            convertedFileName={convertedFileName}
            onDownload={handleDownload}
          />
        </div>

        {/* 使用说明 */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              使用说明
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">支持的格式</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• EPUB格式电子书</li>
                  <li>• 包含中文内容</li>
                  <li>• 支持复杂排版</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">转换特点</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• 支持繁简双向转换</li>
                  <li>• 保持原有格式不变</li>
                  <li>• 页面数量完全一致</li>
                  <li>• 自动转换文件名</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">如有任何建议或需要，请联系：</span>
              <a 
                href="mailto:leojustry@gmail.com" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                leojustry@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
