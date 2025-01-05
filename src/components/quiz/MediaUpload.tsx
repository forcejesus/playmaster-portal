import { Upload, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaUploadProps {
  questionMedia: File | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  setQuestionMedia: (file: File | null) => void;
}

export const MediaUpload = ({
  questionMedia,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDrop,
  setQuestionMedia
}: MediaUploadProps) => {
  return (
    <div 
      className={`
        bg-gradient-to-br from-background to-secondary/20 rounded-xl p-10 mb-6 
        border-2 border-dashed transition-all duration-300 cursor-pointer
        ${questionMedia ? 'border-green-400 bg-green-50' : 'border-primary/30 hover:border-primary'}
      `}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
      />
      <div className="flex flex-col items-center gap-3 text-primary">
        {questionMedia ? (
          <>
            <Check className="w-12 h-12 text-green-500" />
            <p className="text-center text-lg font-medium text-green-600">
              {questionMedia.name}
            </p>
            <Button 
              variant="outline" 
              className="mt-3 border-green-400 text-green-600 hover:bg-green-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setQuestionMedia(null);
              }}
            >
              <X className="w-5 h-5 mr-2" />
              Supprimer le fichier
            </Button>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12" />
            <p className="text-center text-lg font-medium">
              Trouve et insère un contenu multimédia
            </p>
            <p className="text-sm text-primary/80 mt-2">
              Cliquez ou déposez un fichier ici
            </p>
          </>
        )}
      </div>
    </div>
  );
};