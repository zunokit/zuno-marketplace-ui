import { faker } from "./faker-instance";

/**
 * Generate a random image URL
 * @deprecated Use faker.image.urlPicsumPhotos() directly
 */
export const randomImage = (width = 1920, height = 1080) => {
  return faker.image.urlPicsumPhotos({ width, height });
};
