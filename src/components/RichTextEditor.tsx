import React, { useState, useRef, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Quote,
  Code,
  Undo,
  Redo,
  Upload,
  X,
  Check
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "开始编写您的文章内容...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // 执行富文本命令
  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // 工具栏按钮配置
  const toolbarButtons = [
    {
      group: 'format',
      buttons: [
        { icon: Bold, command: 'bold', title: '粗体 (Ctrl+B)' },
        { icon: Italic, command: 'italic', title: '斜体 (Ctrl+I)' },
        { icon: Underline, command: 'underline', title: '下划线 (Ctrl+U)' },
      ]
    },
    {
      group: 'align',
      buttons: [
        { icon: AlignLeft, command: 'justifyLeft', title: '左对齐' },
        { icon: AlignCenter, command: 'justifyCenter', title: '居中对齐' },
        { icon: AlignRight, command: 'justifyRight', title: '右对齐' },
      ]
    },
    {
      group: 'list',
      buttons: [
        { icon: List, command: 'insertUnorderedList', title: '无序列表' },
        { icon: ListOrdered, command: 'insertOrderedList', title: '有序列表' },
      ]
    },
    {
      group: 'insert',
      buttons: [
        { icon: Link, command: 'createLink', title: '插入链接', needsInput: true },
        { icon: Image, command: 'insertImage', title: '插入图片', custom: true },
        { icon: Quote, command: 'formatBlock', value: 'blockquote', title: '引用' },
        { icon: Code, command: 'formatBlock', value: 'pre', title: '代码块' },
      ]
    },
    {
      group: 'history',
      buttons: [
        { icon: Undo, command: 'undo', title: '撤销 (Ctrl+Z)' },
        { icon: Redo, command: 'redo', title: '重做 (Ctrl+Y)' },
      ]
    }
  ];

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    setUploadError('');
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setUploadError('请选择图片文件');
      return;
    }
    
    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('文件大小不能超过 5MB');
      return;
    }
    
    setUploadedFile(file);
    
    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadPreview(result);
      setImageUrl(result);
      setImageAlt(file.name.split('.')[0]);
    };
    reader.readAsDataURL(file);
  };

  // 处理拖拽
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // 处理按钮点击
  const handleButtonClick = (button: any) => {
    if (button.custom && button.command === 'insertImage') {
      setShowImageModal(true);
      return;
    }

    if (button.needsInput && button.command === 'createLink') {
      const url = prompt('请输入链接地址:');
      if (url) {
        executeCommand(button.command, url);
      }
      return;
    }

    if (button.value) {
      executeCommand(button.command, button.value);
    } else {
      executeCommand(button.command);
    }
  };

  // 插入图片到编辑器
  const insertImageToEditor = () => {
    if (!imageUrl) {
      setUploadError('请选择图片或输入图片URL');
      return;
    }

    // 创建图片HTML
    const imgHtml = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />`;
    
    // 插入到编辑器
    if (editorRef.current) {
      editorRef.current.focus();
      executeCommand('insertHTML', imgHtml);
    }
    
    // 关闭模态框并重置状态
    closeImageModal();
  };

  // 关闭图片模态框
  const closeImageModal = () => {
    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
    setUploadedFile(null);
    setUploadPreview('');
    setUploadError('');
    setIsDragging(false);
  };

  // 处理内容变化
  const handleContentChange = () => {
    if (editorRef.current) {
      // 防止初始化时触发不必要的onChange
      // 确保每次内容变化都触发onChange
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  // 处理键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          executeCommand('undo');
          break;
        case 'y':
          e.preventDefault();
          executeCommand('redo');
          break;
      }
    }
  };

  // 处理编辑器内的图片粘贴
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          handleFileSelect(file);
          setShowImageModal(true);
        }
        break;
      }
    }
  };

  // 初始化编辑器内容
  React.useEffect(() => {
    if (editorRef.current && !isInitialized) {
      // 设置初始内容
      if (value) {
        editorRef.current.innerHTML = value;
      }
      setIsInitialized(true);
    }
  }, [value, isInitialized]);
  
  // 当value从外部更新时同步到编辑器
  React.useEffect(() => {
    if (editorRef.current && isInitialized && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isInitialized]);

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* 工具栏 */}
      <div className="bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex flex-wrap gap-2">
          {toolbarButtons.map((group, groupIndex) => (
            <div key={groupIndex} className="flex gap-1">
              {group.buttons.map((button, buttonIndex) => {
                const IconComponent = button.icon;
                return (
                  <button
                    key={buttonIndex}
                    type="button"
                    onClick={() => handleButtonClick(button)}
                    className="p-2 rounded hover:bg-gray-200 transition-colors border border-transparent hover:border-gray-300"
                    title={button.title}
                  >
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  </button>
                );
              })}
              {groupIndex < toolbarButtons.length - 1 && (
                <div className="w-px bg-gray-300 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* 格式选择器 */}
        <div className="flex gap-2 mt-2">
          <select
            onChange={(e) => executeCommand('formatBlock', e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
            defaultValue=""
          >
            <option value="">段落格式</option>
            <option value="h1">标题 1</option>
            <option value="h2">标题 2</option>
            <option value="h3">标题 3</option>
            <option value="h4">标题 4</option>
            <option value="p">正文</option>
          </select>

          <select
            onChange={(e) => executeCommand('fontSize', e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
            defaultValue="3"
          >
            <option value="1">很小</option>
            <option value="2">小</option>
            <option value="3">正常</option>
            <option value="4">大</option>
            <option value="5">很大</option>
            <option value="6">超大</option>
          </select>

          <input
            type="color"
            onChange={(e) => executeCommand('foreColor', e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            title="文字颜色"
          />

          <input
            type="color"
            onChange={(e) => executeCommand('hiliteColor', e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            title="背景颜色"
          />
        </div>
      </div>

      {/* 编辑区域 */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[400px] p-4 focus:outline-none"
        style={{ lineHeight: '1.6' }}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown} 
        onPaste={handlePaste}
        dangerouslySetInnerHTML={isInitialized ? undefined : { __html: value }}
        data-placeholder={placeholder}
      />

      {/* 图片插入模态框 */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">插入图片</h3>
              <button
                onClick={closeImageModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 文件上传区域 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  上传图片
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                  />
                  
                  {uploadPreview ? (
                    <div className="space-y-2">
                      <img
                        src={uploadPreview}
                        alt="预览"
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="flex items-center justify-center text-green-600">
                        <Check className="w-4 h-4 mr-1" />
                        <span className="text-sm">图片已选择</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">
                        点击选择图片或拖拽图片到此处
                      </p>
                      <p className="text-xs text-gray-500">
                        支持 JPG、PNG、GIF，最大 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 分割线 */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">或</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              
              {/* URL输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图片地址
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {/* 图片描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图片描述
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="图片描述"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      insertImageToEditor();
                    }
                  }}
                />
              </div>

              {/* 错误提示 */}
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}

              {/* URL预览 */}
              {imageUrl && !uploadPreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    图片预览
                  </label>
                  <img
                    src={imageUrl}
                    alt="预览"
                    className="w-full h-32 object-cover rounded border"
                    onError={() => setUploadError('图片URL无效或无法加载')}
                    onLoad={() => setUploadError('')}
                  />
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeImageModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={insertImageToEditor}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                插入图片
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        [contenteditable] h4 {
          font-size: 1em;
          font-weight: bold;
          margin: 1.12em 0;
        }
        
        [contenteditable] blockquote {
          margin: 1em 0;
          padding-left: 1em;
          border-left: 4px solid #e5e7eb;
          color: #6b7280;
        }
        
        [contenteditable] pre {
          background-color: #f3f4f6;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: monospace;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] img {
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        [contenteditable] img:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;