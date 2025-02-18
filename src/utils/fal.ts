
import * as fal from '@fal-ai/serverless-client';

export type FalModel = 'fashn/tryon';
export type FalCategory = 'tops' | 'bottoms' | 'one-pieces';

interface FalImage {
  url: string;
}

interface FalResponse {
  images: FalImage[];
}

interface FalError {
  message: string;
  details?: string;
}

export const initializeFal = (apiKey: string) => {
  try {
    fal.config({
      credentials: apiKey,
      proxyUrl: 'https://110011.org/api', // Use FAL's official CORS proxy
    });
    localStorage.setItem('FAL_KEY', apiKey);
  } catch (error) {
    console.error('Error initializing FAL:', error);
    throw new Error('Failed to initialize FAL API client');
  }
};

export const generateTryOn = async (
  personImage: string, 
  clothingImage: string, 
  category: FalCategory = 'tops',
  model: FalModel = 'fashn/tryon'
) => {
  if (!personImage || !clothingImage) {
    throw new Error('Both person and clothing images are required');
  }

  try {
    console.log('Starting try-on generation...');
    console.log('Person image:', personImage?.slice(0, 100) + '...');
    console.log('Clothing image:', clothingImage?.slice(0, 100) + '...');
    
    // Validate API key
    const apiKey = localStorage.getItem('FAL_KEY');
    if (!apiKey) {
      throw new Error('FAL API key is missing. Please add your API key in settings.');
    }

    // Validate URL format
    const modelUrl = `https://fal.run/${model}`;
    if (!modelUrl.startsWith('https://fal.run/')) {
      throw new Error('Invalid FAL API endpoint');
    }

    const result = await fal.run(model, {
      input: {
        model_image: personImage,
        garment_image: clothingImage,
        category,
      },
    }) as FalResponse;
    
    if (!result || !Array.isArray(result.images) || result.images.length === 0) {
      throw new Error('Invalid response from FAL API');
    }
    
    return { image: result.images[0].url };
  } catch (error: any) {
    console.error('Error generating try-on:', error);
    
    // Handle specific error cases
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      throw new Error('Unable to connect to FAL API. This might be due to CORS restrictions. Please ensure you have the correct API configuration.');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your FAL API key in settings.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }

    // Throw a user-friendly error message
    throw new Error(error.message || 'An error occurred while generating the try-on. Please try again.');
  }
};
