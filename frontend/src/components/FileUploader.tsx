import { FileText, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface FileUploaderProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function FileUploader({ value, onChange, placeholder }: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') onChange(text);
      };
      reader.readAsText(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [readFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) readFile(file);
    },
    [readFile],
  );

  const clearFile = () => {
    setFileName(null);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <button
        type="button"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mx-auto text-gray-400 mb-2" size={28} />
        <p className="text-sm text-gray-600">
          Arrastra un archivo aquí o <span className="text-brand-600 font-medium">haz clic</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">TXT, MD, VTT u otros archivos de texto</p>
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.md,.vtt,.srt,.csv,.json"
          className="hidden"
          onChange={handleFileSelect}
        />
      </button>

      {/* File badge */}
      {fileName && (
        <div className="flex items-center gap-2 text-sm bg-brand-50 text-brand-700 px-3 py-2 rounded-lg">
          <FileText size={16} />
          <span className="flex-1 truncate">{fileName}</span>
          <button type="button" onClick={clearFile} className="hover:text-red-500">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Text area fallback */}
      <textarea
        value={value}
        onChange={(e) => {
          setFileName(null);
          onChange(e.target.value);
        }}
        placeholder={placeholder ?? 'O pega el transcript directamente aquí...'}
        rows={8}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
      />
    </div>
  );
}
