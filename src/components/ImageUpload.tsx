import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload = ({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      // In production, upload to Cloudinary or your backend
      // For now, we'll create object URLs (local preview)
      const newImageUrls: string[] = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        // In production, upload to Cloudinary:
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('upload_preset', 'your_upload_preset');
        // const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        //   method: 'POST',
        //   body: formData,
        // });
        // const data = await response.json();
        // newImageUrls.push(data.secure_url);

        // For now, use object URL (will be lost on refresh - need backend)
        const objectUrl = URL.createObjectURL(file);
        newImageUrls.push(objectUrl);
      }

      onImagesChange([...images, ...newImageUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Revoke object URL to free memory
    if (images[index].startsWith('blob:')) {
      URL.revokeObjectURL(images[index]);
    }
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Charger ${index + 1}`}
              className="w-32 h-32 object-cover rounded-lg border border-gray-700"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-electric-green hover:text-electric-green transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="animate-spin">⏳</div>
            ) : (
              <>
                <span className="text-2xl mb-1">📷</span>
                <span className="text-xs">Add Photo</span>
              </>
            )}
          </motion.button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />
      <p className="text-xs text-gray-500">
        {images.length}/{maxImages} photos • Max 5MB per image
      </p>
      {images.length === 0 && (
        <p className="text-sm text-amber-400">
          ⚠️ Adding photos will significantly increase bookings!
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
