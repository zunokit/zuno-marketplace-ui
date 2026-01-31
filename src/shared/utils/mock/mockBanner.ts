import { Banner } from "@/shared/types/banner";
import { faker } from "./faker-instance";

const VIDEO_URL =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

/**
 * Generate mock banner data
 * @param n Number of banners to generate
 */
export const mockBanner = (n: number): Banner[] => {
  return Array.from({ length: n }, (_, index) => ({
    name: faker.commerce.productName(),
    author: faker.person.fullName(),
    totalItems: faker.number.int({ min: 1, max: 10000 }),
    floorPrice: faker.finance.amount({ min: 2, max: 6, dec: 1 }),
    thumbnailImages: [
      faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
      faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
      faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
    ],
    mainBackground: faker.datatype.boolean()
      ? faker.image.urlPicsumPhotos({ width: 1920, height: 1080 })
      : VIDEO_URL,
  }));
};
