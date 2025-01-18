import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MediaUploadProps {
  questionMedia: File | undefined;
  setQuestionMedia: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}

export const MediaUpload = ({
  questionMedia,
  setQuestionMedia,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDrop,
}: MediaUploadProps) => {
  return (
    <Card
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*"
        className="hidden"
      />
      <div className="space-y-2">
        {questionMedia ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Fichier sélectionné: {questionMedia.name}</p>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setQuestionMedia(undefined as unknown as File);
              }}
            >
              Supprimer le fichier
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              Glissez-déposez un fichier ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-400">
              Formats acceptés: images, vidéos, audio
            </p>
          </>
        )}
      </div>
    </Card>
  );
};