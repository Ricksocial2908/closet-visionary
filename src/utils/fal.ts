
import * as fal from '@fal-ai/serverless-client';

fal.config({
  credentials: localStorage.getItem('FAL_KEY') || '',
});

export const generateTryOn = async (personImage: string, clothingImage: string) => {
  try {
    const result = await fal.run('fal-ai/fashion-tryon', {
      input: {
        person_image: personImage,
        cloth_image: clothingImage,
      },
    });
    return result;
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
    return result;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
};
