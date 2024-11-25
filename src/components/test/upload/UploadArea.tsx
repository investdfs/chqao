import React from 'react';
import { Upload, Loader2 } from "lucide-react";

interface UploadAreaProps {
  file: File | null;
  selectedPdfPath: string | null;
  isProcessing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadArea = ({ file, selectedPdfPath, isProcessing, onFileChange }: UploadAreaProps) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        id="pdf-upload"
        onChange={onFileChange}
        disabled={isProcessing}
      />
      <label
        htmlFor="pdf-upload"
        className={`cursor-pointer flex flex-col items-center space-y-2 ${
          isProcessing ? "opacity-50" : ""
        }`}
      >
        {file ? (
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>{file.name}</span>
          </div>
        ) : selectedPdfPath ? (
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>PDF selecionado da lista</span>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              Clique para fazer upload ou arraste um arquivo PDF
            </span>
          </>
        )}
      </label>
    </div>
  );
};