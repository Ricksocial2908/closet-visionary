
import * as fal from '@fal-ai/serverless-client';

export type FalModel = 'fashn/tryon';
export type FalCategory = 'tops' | 'bottoms' | 'one-pieces';

interface FalImage {
  url: string;
}

interface FalResponse {
  images: FalImage[];
}

export const initializeFal = (apiKey: string) => {
  fal.config({
    credentials: apiKey,
  });
  localStorage.setItem('FAL_KEY', apiKey);
};

export const generateTryOn = async (
  personImage: string, 
  clothingImage: string, 
  category: FalCategory = 'tops',
  model: FalModel = 'fashn/tryon'
) => {
  try {
    const result = await fal.run(model, {
      input: {
        model_image: personImage,
        garment_image: clothingImage,
        category,
      },
    }) as FalResponse;
    
    // Extract the URL from the images array
    if (result && Array.isArray(result.images) && result.images.length > 0) {
      return { image: result.images[0].url };
    }
    
    throw new Error('No image in response');
  } catch (error) {
    console.error('Error generating try-on:', error);
    throw error;
  }
};

export const generateVideo = async (tryOnImage: string) => {
  try {
    const result = await fal.run('fal-ai/image-to-video', {
      input: {
        image: tryOnImage,
      },
    });
    return result as { video: string };
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
};
