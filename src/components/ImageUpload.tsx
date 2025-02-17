
import { useState, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  label: string;
}

const ImageUpload = ({ onImageSelect, label }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/30 border border-white/20 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{label}</h3>
        <div className="relative h-64 w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          {preview ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-50">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload</p>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>
    </Card>
  );
};

export default ImageUpload;
