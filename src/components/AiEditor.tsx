import React, { useEffect, useRef } from 'react';
import { AiEditor } from 'aieditor';
import 'aieditor/dist/style.css';

interface AiEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const AiEditorComponent: React.FC<AiEditorProps> = ({
  value,
  onChange,
  placeholder = "开始编写您的文章内容...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const aiEditorRef = useRef<AiEditor | null>(null);

  useEffect(() => {
    if (editorRef.current && !aiEditorRef.current) {
      // 初始化 AiEditor
      aiEditorRef.current = new AiEditor({
        element: editorRef.current,
        placeholder,
        content: value,
        onChange: (editor) => {
          const content = editor.getHtml();
          onChange(content);
        },
        // 配置工具栏
        toolbarKeys: [
          'undo', 'redo', 'brush', 'eraser',
          '|',
          'heading', 'font-family', 'font-size',
          '|', 
          'bold', 'italic', 'underline', 'strike', 'link', 'code', 'subscript', 'superscript',
          'hr', '|',
          'font-color', '|',
          'align', 'line-height', '|',
          'bullet-list', 'ordered-list', 'indent-decrease', 'indent-increase', 'break',
          '|',
          'image', 'video', 'table', 'code-block', 'quote', 'container',
          '|',
          'source-code', 'printer', 'fullscreen'
        ],
        // 图片上传配置
        image: {
          allowBase64: true,
          uploadUrl: '/api/upload/image', // 如果有后端上传接口
          uploadHeaders: {
            'Authorization': 'Bearer token'
          },
          // 自定义上传方法
          uploader: (file: File) => {
            return new Promise((resolve) => {
              // 转换为 base64 用于预览
              const reader = new FileReader();
              reader.onload = () => {
                resolve({
                  errorCode: 0,
                  data: {
                    src: reader.result as string,
                    alt: file.name
                  }
                });
              };
              reader.readAsDataURL(file);
            });
          }
        },
        // 视频配置
        video: {
          allowBase64: true,
          uploadUrl: '/api/upload/video'
        },
        // 附件配置
        attachment: {
          uploadUrl: '/api/upload/attachment'
        },
        // 字体配置
        fontFamily: {
          values: [
            "默认字体",
            "微软雅黑, Microsoft YaHei",
            "宋体, SimSun", 
            "黑体, SimHei",
            "Arial, sans-serif",
            "Times New Roman, serif",
            "Courier New, monospace"
          ]
        },
        // 字号配置
        fontSize: {
          values: ["12px", "13px", "14px", "15px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px", "56px", "64px", "72px"]
        },
        // 颜色配置
        fontColor: {
          presetColors: [
            "#000000", "#333333", "#666666", "#999999", "#cccccc", "#ffffff",
            "#ff0000", "#ff6600", "#ff9900", "#ffcc00", "#ffff00", "#ccff00",
            "#99ff00", "#66ff00", "#33ff00", "#00ff00", "#00ff33", "#00ff66",
            "#00ff99", "#00ffcc", "#00ffff", "#00ccff", "#0099ff", "#0066ff",
            "#0033ff", "#0000ff", "#3300ff", "#6600ff", "#9900ff", "#cc00ff",
            "#ff00ff", "#ff00cc", "#ff0099", "#ff0066", "#ff0033"
          ]
        },
        // 行高配置
        lineHeight: {
          values: ["1", "1.2", "1.5", "1.75", "2", "2.5", "3"]
        },
        // 链接配置
        link: {
          autolink: true,
          rel: "nofollow"
        },
        // 代码块配置
        codeBlock: {
          allowCopy: true,
          languages: [
            { value: "javascript", label: "JavaScript" },
            { value: "typescript", label: "TypeScript" },
            { value: "python", label: "Python" },
            { value: "java", label: "Java" },
            { value: "html", label: "HTML" },
            { value: "css", label: "CSS" },
            { value: "sql", label: "SQL" },
            { value: "json", label: "JSON" },
            { value: "xml", label: "XML" },
            { value: "bash", label: "Bash" }
          ]
        },
        // 表格配置
        table: {
          allowResize: true
        },
        // 容器配置
        container: {
          types: [
            { value: "info", label: "信息", icon: "ℹ️" },
            { value: "warning", label: "警告", icon: "⚠️" },
            { value: "danger", label: "危险", icon: "❌" },
            { value: "success", label: "成功", icon: "✅" }
          ]
        },
        // 主题配置
        theme: "light",
        // 高度配置
        height: 400,
        // 语言配置
        lang: "zh"
      });
    }

    // 清理函数
    return () => {
      if (aiEditorRef.current) {
        // 延迟销毁编辑器，避免与 React 的 DOM 卸载产生竞态条件
        setTimeout(() => {
          if (aiEditorRef.current) {
            aiEditorRef.current.destroy();
            aiEditorRef.current = null;
          }
        }, 0);
      }
    };
  }, []);

  // 当外部 value 变化时更新编辑器内容
  useEffect(() => {
    if (aiEditorRef.current && value !== aiEditorRef.current.getHtml()) {
      aiEditorRef.current.setContent(value);
    }
  }, [value]);

  return (
    <div className={`aieditor-container ${className}`}>
      <div ref={editorRef} />
      <style jsx>{`
        .aieditor-container {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .aieditor-container :global(.aie-container) {
          border: none !important;
        }
        
        .aieditor-container :global(.aie-toolbar) {
          border-bottom: 1px solid #e5e7eb !important;
          background: #f9fafb !important;
        }
        
        .aieditor-container :global(.aie-content) {
          min-height: 400px !important;
          padding: 16px !important;
        }
        
        .aieditor-container :global(.aie-content img) {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          margin: 10px 0 !important;
        }
        
        .aieditor-container :global(.aie-content table) {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 16px 0 !important;
        }
        
        .aieditor-container :global(.aie-content table td),
        .aieditor-container :global(.aie-content table th) {
          border: 1px solid #e5e7eb !important;
          padding: 8px 12px !important;
        }
        
        .aieditor-container :global(.aie-content table th) {
          background: #f9fafb !important;
          font-weight: 600 !important;
        }
        
        .aieditor-container :global(.aie-content blockquote) {
          border-left: 4px solid #3b82f6 !important;
          padding-left: 16px !important;
          margin: 16px 0 !important;
          color: #6b7280 !important;
          background: #f8fafc !important;
          padding: 16px !important;
          border-radius: 0 8px 8px 0 !important;
        }
        
        .aieditor-container :global(.aie-content pre) {
          background: #1f2937 !important;
          color: #f9fafb !important;
          padding: 16px !important;
          border-radius: 8px !important;
          overflow-x: auto !important;
          margin: 16px 0 !important;
        }
        
        .aieditor-container :global(.aie-content code) {
          background: #f3f4f6 !important;
          color: #ef4444 !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          font-family: 'Courier New', monospace !important;
        }
        
        .aieditor-container :global(.aie-content pre code) {
          background: transparent !important;
          color: inherit !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default AiEditorComponent;