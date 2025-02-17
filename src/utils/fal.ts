
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
    console.log('Starting try-on generation...');
    console.log('Person image:', personImage?.slice(0, 100) + '...');
    console.log('Clothing image:', clothingImage?.slice(0, 100) + '...');
    
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
