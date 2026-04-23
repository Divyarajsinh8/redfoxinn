import { useSanityClient } from '@sanity/astro';

export const sanityClient = useSanityClient();

export async function getRooms() {
  return sanityClient.fetch(
    `*[_type == "room"] | order(order asc, name asc) {
      _id, name, slug, roomType, sleeps, priceFrom, shortDescription, amenities, images, order
    }`,
  );
}

export async function getRoomBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "room" && slug.current == $slug][0] {
      _id, name, slug, roomType, sleeps, priceFrom, shortDescription, story, amenities, images
    }`,
    { slug },
  );
}

export async function getJournalPosts() {
  return sanityClient.fetch(
    `*[_type == "journalPost"] | order(publishedAt desc) {
      _id, title, slug, publishedAt, excerpt, coverImage
    }`,
  );
}
