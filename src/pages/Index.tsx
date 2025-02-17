
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';
import ImageUpload from '../components/ImageUpload';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { generateTryOn, generateVideo } from '../utils/fal';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const { toast } = useToast();

  const handleTryOn = async () => {
    if (!personImage || !clothingImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both a person and clothing image.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tryOnResult = await generateTryOn(personImage, clothingImage);
      setResult(tryOnResult.image);
      toast({
        title: "Success",
        description: "Try-on generated successfully!",
      });
    } catch (error) {
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
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Virtual Try-On</h1>
          <p className="text-lg text-gray-600">Upload images to see how clothes look on you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ImageUpload onImageSelect={setPersonImage} label="Upload Person Image" />
          <ImageUpload onImageSelect={setClothingImage} label="Upload Clothing Image" />
        </div>

        <div className="flex justify-center gap-4">
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

          {result && (
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
          )}
        </div>

        {result && (
          <Card className="p-6 backdrop-blur-sm bg-white/30 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <div className="aspect-w-1 aspect-h-1">
              <img src={result} alt="Try-on result" className="rounded-lg object-cover" />
            </div>
          </Card>
        )}

        {video && (
          <Card className="p-6 backdrop-blur-sm bg-white/30 border border-white/20">
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
  );
};

export default Index;
