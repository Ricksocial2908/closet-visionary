
import { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import ImageUpload from '../components/ImageUpload';
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
import { generateTryOn, generateVideo, initializeFal, type FalModel, type FalCategory } from '../utils/fal';
import { Loader2, Settings } from 'lucide-react';

const Index = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('FAL_KEY') || '');
  const [selectedModel, setSelectedModel] = useState<FalModel>('fashn/tryon');
  const [selectedCategory, setSelectedCategory] = useState<FalCategory>('tops');
  const { toast } = useToast();

  useEffect(() => {
    if (apiKey) {
      initializeFal(apiKey);
    }
  }, [apiKey]);

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

  const handleVideoGeneration = async () => {
    if (!result) {
      toast({
        title: "No Image",
        description: "Please generate a try-on image first.",
        variant: "destructive",
      });
      return;
    }

    setVideoLoading(true);
    try {
      const videoResult = await generateVideo(result);
      setVideo(videoResult.video);
      toast({
        title: "Success",
        description: "Video generated successfully!",
      });
    } catch (error) {
      console.error('Error in handleVideoGeneration:', error);
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVideoLoading(false);
    }
  };

  // Debug useEffect to monitor result state
  useEffect(() => {
    console.log('Result state changed:', result ? 'Has image' : 'No image');
    if (result) {
      console.log('Result preview:', result.slice(0, 100) + '...');
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Virtual Try-On</h1>
            <p className="text-lg text-gray-600">Upload images to see how clothes look on you</p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>
                  Configure your FAL.ai API settings
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">FAL.ai API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your FAL.ai API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={selectedModel}
                    onValueChange={(value) => setSelectedModel(value as FalModel)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashn/tryon">Fashion Try-On</SelectItem>
                      <SelectItem value="fal-ai/fashion-edit">Fashion Edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value as FalCategory)}
                  >
                    <SelectTrigger>
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

        <div className="grid md:grid-cols-2 gap-8">
          <div className="max-w-[400px] mx-auto w-full">
            <ImageUpload onImageSelect={setPersonImage} label="Upload Person Image" />
          </div>
          <div className="max-w-[400px] mx-auto w-full">
            <ImageUpload onImageSelect={setClothingImage} label="Upload Clothing Image" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center">
            <Button
              onClick={handleTryOn}
              disabled={loading || !personImage || !clothingImage}
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Try-On'
              )}
            </Button>
          </div>

          {result && (
            <Card className="p-6 backdrop-blur-sm bg-white/30 border border-white/20 max-w-[800px] mx-auto">
              <h2 className="text-xl font-semibold mb-4">Try-On Result</h2>
              <div className="bg-white rounded-lg overflow-hidden">
                <img 
                  src={result} 
                  alt="Try-on result" 
                  className="w-full h-auto max-h-[600px] object-contain"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleVideoGeneration}
                  disabled={videoLoading}
                  className="min-w-[200px]"
                >
                  {videoLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Video...
                    </>
                  ) : (
                    'Generate Video'
                  )}
                </Button>
              </div>
            </Card>
          )}

          {video && (
            <Card className="p-6 backdrop-blur-sm bg-white/30 border border-white/20 max-w-[800px] mx-auto">
              <h2 className="text-xl font-semibold mb-4">Video</h2>
              <video
                controls
                className="w-full rounded-lg"
                src={video}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
