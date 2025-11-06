export interface Photo {
  id: string;
  url: string;
  title: string;
  tags: string[];
  likes: number;
  downloads: number;
  views: number;
  photographer?: string;
  dateTaken?: string;
}

/**
 * Generates a random alphanumeric ID
 */
function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Selects random items from an array ensuring uniqueness
 */
function getRandomItems<T>(array: readonly T[], count: number): T[] {
  const shuffled: T[] = [...array].sort(() => Math.random() - 0.5);
  const uniqueItems: Set<T> = new Set(shuffled.slice(0, Math.min(count, array.length)));
  return Array.from(uniqueItems);
}

/**
 * Generates a random number within a specified range
 */
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random date within the past year
 */
function getRandomDate(): string {
  const today: Date = new Date();
  const pastYear: Date = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const randomTime: number = pastYear.getTime() + Math.random() * (today.getTime() - pastYear.getTime());
  const randomDate: Date = new Date(randomTime);
  return randomDate.toISOString().split('T')[0];
}

// Photo titles organized by category
const PHOTO_TITLES: readonly string[] = [
  'Sunset Landscape',
  'Portrait Study',
  'Architecture',
  'Nature Close-up',
  'Street Photography',
  'Wedding Moment',
  'Mountain Vista',
  'Urban Nightscape',
  'Wildlife Portrait'
] as const;

// Available tags for photos
const AVAILABLE_TAGS: readonly string[] = [
  'landscape',
  'portrait',
  'architecture',
  'nature',
  'wildlife',
  'street',
  'wedding',
  'professional',
  'studio',
  'macro',
  'city',
  'building',
  'sunset',
  'night',
  'lights',
  'animal',
  'urban',
  'candid',
  'love',
  'ceremony',
  'mountain',
  'adventure',
  'flowers'
] as const;

// Photographer names
const PHOTOGRAPHERS: readonly string[] = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Wilson',
  'Alex Brown',
  'Emma Davis',
  'David Chen',
  'Lisa Martinez',
  'Tom Anderson'
] as const;

/**
 * Generates mock photo data with random but realistic values
 */
export function generateMockPhotoData(count: number): Photo[] {
  return Array.from({ length: count }, (_: unknown, index: number): Photo => {
    const photoId: string = generateRandomId();
    const photoUrl: string = `/placeholder-${index + 1}.jpg`;
    const photoTitle: string = PHOTO_TITLES[index % PHOTO_TITLES.length];
    const uniqueTags: string[] = getRandomItems(AVAILABLE_TAGS, getRandomNumber(2, 4));
    const photoLikes: number = getRandomNumber(50, 350);
    const photoDownloads: number = getRandomNumber(20, 150);
    const photoViews: number = getRandomNumber(500, 5000);
    const photoPhotographer: string = PHOTOGRAPHERS[index % PHOTOGRAPHERS.length];
    const photoDateTaken: string = getRandomDate();

    return {
      id: photoId,
      url: photoUrl,
      title: photoTitle,
      tags: uniqueTags,
      likes: photoLikes,
      downloads: photoDownloads,
      views: photoViews,
      photographer: photoPhotographer,
      dateTaken: photoDateTaken
    };
  });
}

// Export mock photos generated using the function
export const mockPhotos: Photo[] = generateMockPhotoData(9);
