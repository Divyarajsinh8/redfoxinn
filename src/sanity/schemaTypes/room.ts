import { defineField, defineType } from 'sanity';

export const room = defineType({
  name: 'room',
  title: 'Room',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Room name',
      type: 'string',
      description: 'Individually named, e.g. "The Israel River Room".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'roomType',
      title: 'Room type',
      type: 'string',
      options: {
        list: [
          { title: 'King', value: 'king' },
          { title: 'Queen', value: 'queen' },
          { title: 'Double Queen', value: 'double-queen' },
          { title: 'Suite', value: 'suite' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sleeps',
      title: 'Sleeps',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'priceFrom',
      title: 'Price from (USD)',
      type: 'number',
      description: 'Starting nightly rate before taxes.',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown on the Rooms index.',
    }),
    defineField({
      name: 'story',
      title: 'Room story',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Landmark/history narrative for this specific room name.',
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first on the Rooms index.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'roomType', media: 'images.0' },
  },
});
