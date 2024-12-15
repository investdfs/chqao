import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadFieldProps {
  imageUrl?: string;
  onImageChange: (url: string) => void;
}

export const ImageUploadField = ({ imageUrl, onImageChange }: ImageUploadFieldProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log('Uploading image:', file.name);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('question_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      console.log('Image uploaded successfully:', filePath);

      const { data: { publicUrl } } = supabase.storage
        .from('question_images')
        .getPublicUrl(filePath);

      setImagePreview(publicUrl);
      onImageChange(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageChange('');
  };

  const currentImage = imagePreview || imageUrl;

  return (
    <div className="space-y-2">
      <Label>Imagem da Questão (opcional)</Label>
      <div className="flex flex-col gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
          className="bg-white dark:bg-gray-800"
        />
        {currentImage && (
          <div className="relative">
            <img
              src={currentImage}
              alt="Preview"
              className="max-h-48 object-contain cursor-pointer"
              onClick={() => setShowImageModal(true)}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-12"
              onClick={() => setShowImageModal(true)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl">
          <img
            src={currentImage}
            alt="Question"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};