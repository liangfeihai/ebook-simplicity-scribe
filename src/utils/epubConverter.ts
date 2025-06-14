import JSZip from 'jszip';
import * as OpenCC from 'opencc-js';

export class EpubConverter {
  private converter: any;

  constructor() {
    // 初始化繁体转简体转换器
    this.converter = OpenCC.Converter({ from: 'hk', to: 'cn' });
  }

  async convertEpubFile(file: File, onProgress: (progress: number, message: string) => void): Promise<Blob> {
    try {
      onProgress(10, '正在读取EPUB文件...');
      
      // 读取EPUB文件（实际上是ZIP文件）
      const zip = new JSZip();
      const epubZip = await zip.loadAsync(file);
      
      onProgress(20, '正在分析文件结构...');
      
      // 获取所有文件
      const files = Object.keys(epubZip.files);
      let processedCount = 0;
      
      // 处理每个文件
      for (const fileName of files) {
        const fileEntry = epubZip.files[fileName];
        
        if (!fileEntry.dir) {
          // 检查是否是文本文件（HTML、XML、CSS等）
          if (this.isTextFile(fileName)) {
            onProgress(
              20 + (processedCount / files.length) * 70,
              `正在处理: ${fileName}`
            );
            
            const content = await fileEntry.async('text');
            const convertedContent = this.convertText(content);
            
            // 更新文件内容
            epubZip.file(fileName, convertedContent);
          }
        }
        
        processedCount++;
      }
      
      onProgress(95, '正在生成新的EPUB文件...');
      
      // 生成新的EPUB文件
      const newEpubBlob = await epubZip.generateAsync({
        type: 'blob',
        mimeType: 'application/epub+zip'
      });
      
      onProgress(100, '转换完成！');
      
      return newEpubBlob;
      
    } catch (error) {
      console.error('EPUB转换失败:', error);
      throw new Error('EPUB文件转换失败，请检查文件格式是否正确');
    }
  }

  private isTextFile(fileName: string): boolean {
    const textExtensions = ['.html', '.xhtml', '.xml', '.css', '.txt', '.ncx', '.opf'];
    const lowerFileName = fileName.toLowerCase();
    return textExtensions.some(ext => lowerFileName.endsWith(ext));
  }

  private convertText(text: string): string {
    try {
      // 使用OpenCC进行繁简转换
      return this.converter(text);
    } catch (error) {
      console.error('文本转换失败:', error);
      // 如果转换失败，返回原文本
      return text;
    }
  }
}
