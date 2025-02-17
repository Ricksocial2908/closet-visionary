
import * as fal from '@fal-ai/serverless-client';

export type FalModel = 'fashn/tryon' | 'fal-ai/fashion-edit';
export type FalCategory = 'tops' | 'bottoms' | 'one-pieces';

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
    });
    return result as { image: string };
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
