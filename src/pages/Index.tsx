import { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import ImageUpload from '../components/ImageUpload';
import Gallery from '../components/Gallery';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import { generateTryOn, initializeFal, type FalModel, type FalCategory } from '../utils/fal';
import { getGallery, saveToGallery, type GalleryItem } from '../utils/gallery';
import { downloadImage } from '../utils/download';
import { Loader2, Save, Settings, Download } from 'lucide-react';

const Index = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('FAL_KEY') || '');
  const [selectedModel] = useState<FalModel>('fashn/tryon');
  const [selectedCategory, setSelectedCategory] = useState<FalCategory>('tops');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (apiKey) {
      initializeFal(apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    setGalleryItems(getGallery());
  }, []);

  const handleTryOn = async () => {
    if (!personImage || !clothingImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both a person and clothing image.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Missing API Key",
        description: "Please add your FAL.ai API key in settings.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting try-on generation...');
      console.log('Person image:', personImage?.slice(0, 100) + '...');
      console.log('Clothing image:', clothingImage?.slice(0, 100) + '...');
      
      const tryOnResult = await generateTryOn(personImage, clothingImage, selectedCategory, selectedModel);
      console.log('Try-on result received:', tryOnResult);
      
      if (tryOnResult && tryOnResult.image) {
        console.log('Setting result image:', tryOnResult.image.slice(0, 100) + '...');
        setResult(tryOnResult.image);
        toast({
          title: "Success",
          description: "Try-on generated successfully!",
        });
      } else {
        console.error('No image in result:', tryOnResult);
        toast({
          title: "Error",
          description: "Failed to generate try-on. No image in response.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleTryOn:', error);
      toast({
        title: "Error",
        description: "Failed to generate try-on. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToGallery = () => {
    if (!result) return;
    
    const savedItem = saveToGallery(result, selectedCategory);
    setGalleryItems(prev => [savedItem, ...prev]);
    
    toast({
      title: "Saved to Gallery",
      description: "Your creation has been saved to the gallery.",
    });
  };

  const handleGalleryDelete = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from Gallery",
      description: "The item has been removed from your gallery.",
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const fileName = `try-on-${selectedCategory}-${new Date().toISOString().split('T')[0]}.png`;
    downloadImage(result, fileName);
    
    toast({
      title: "Download Started",
      description: "Your image is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 font-playfair">
              Virtual Try-On
            </h1>
            <p className="text-lg text-gray-600 font-playfair">
              Experience how clothes look on you before you buy
            </p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-playfair text-2xl">Settings</SheetTitle>
                <SheetDescription className="font-playfair">
                  Configure your FAL.ai API settings
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="font-playfair">FAL.ai API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your FAL.ai API key"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-playfair">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value as FalCategory)}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tops">Tops</SelectItem>
                      <SelectItem value="bottoms">Bottoms</SelectItem>
                      <SelectItem value="one-pieces">One Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="max-w-[400px] mx-auto w-full">
            <ImageUpload onImageSelect={setPersonImage} label="Upload Person Image" />
          </div>
          <div className="max-w-[400px] mx-auto w-full">
            <ImageUpload onImageSelect={setClothingImage} label="Upload Clothing Image" />
          </div>
        </div>

        <div className="space-y-12">
          <div className="flex justify-center">
            <Button
              onClick={handleTryOn}
              disabled={loading || !personImage || !clothingImage}
              className="min-w-[200px] rounded-full font-playfair text-lg h-12 transition-all hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Try-On'
              )}
            </Button>
          </div>

          {result && (
            <Card className="p-8 backdrop-blur-sm bg-white/80 border border-white/40 max-w-[800px] mx-auto shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold font-playfair text-gray-900">Try-On Result</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    className="gap-2 font-playfair"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    onClick={handleSaveToGallery}
                    variant="outline"
                    className="gap-2 font-playfair"
                  >
                    <Save className="h-4 w-4" />
                    Save to Gallery
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={result} 
                  alt="Try-on result" 
                  className="w-full h-auto max-h-[600px] object-contain"
                />
              </div>
            </Card>
          )}

          <Gallery items={galleryItems} onDelete={handleGalleryDelete} />
        </div>
      </div>
    </div>
  );
};

export default Index;
