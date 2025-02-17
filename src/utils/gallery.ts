
export interface GalleryItem {
  id: string;
  image: string;
  category: string;
  createdAt: Date;
}

export const saveToGallery = (image: string, category: string): GalleryItem => {
  const galleries = getGallery();
  const newItem: GalleryItem = {
    id: crypto.randomUUID(),
    image,
    category,
    createdAt: new Date(),
  };
  
  localStorage.setItem('gallery', JSON.stringify([newItem, ...galleries]));
  return newItem;
};

export const getGallery = (): GalleryItem[] => {
  const gallery = localStorage.getItem('gallery');
  if (!gallery) return [];
  return JSON.parse(gallery);
};

export const removeFromGallery = (id: string) => {
  const galleries = getGallery();
  const filtered = galleries.filter(item => item.id !== id);
  localStorage.setItem('gallery', JSON.stringify(filtered));
};
