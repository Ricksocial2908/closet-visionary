
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { GalleryItem, removeFromGallery } from '../utils/gallery';
import { downloadImage } from '../utils/download';
import { Download, GalleryHorizontal, Trash2 } from 'lucide-react';

interface GalleryProps {
  items: GalleryItem[];
  onDelete: (id: string) => void;
}

const Gallery = ({ items, onDelete }: GalleryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = (id: string) => {
    removeFromGallery(id);
    onDelete(id);
  };

  const handleDownload = (item: GalleryItem) => {
    const fileName = `try-on-${item.category}-${new Date(item.createdAt).toISOString().split('T')[0]}.png`;
    downloadImage(item.image, fileName);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 border border-white/40 shadow-xl rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <GalleryHorizontal className="h-5 w-5" />
          <h2 className="text-2xl font-semibold font-playfair text-gray-900">Your Gallery</h2>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-playfair"
        >
          {isExpanded ? 'Show Less' : 'Show All'}
        </Button>
      </div>
      <div className={`grid gap-6 ${isExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {(isExpanded ? items : items.slice(0, 1)).map((item) => (
          <div key={item.id} className="relative group">
            <img
              src={item.image}
              alt={`Gallery item ${item.category}`}
              className="w-full h-auto rounded-lg shadow-md"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleDownload(item)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-playfair capitalize">{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Gallery;
