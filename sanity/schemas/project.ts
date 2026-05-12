import { defineField, defineType } from "sanity";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Photography", value: "photo" },
          { title: "Videography", value: "video" },
          { title: "Web", value: "web" },
          { title: "Design", value: "design" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "cvCompanies",
      title: "Show on CV under",
      description:
        "Tick which CV company/employer this project should appear under on the /cv page.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Age Care Bathrooms", value: "age-care-bathrooms" },
          {
            title: "Lime Tree Music Centre",
            value: "lime-tree-music-centre",
          },
          { title: "The Musical Me", value: "the-musical-me" },
        ],
      },
    }),
    defineField({
      name: "year",
      type: "number",
      validation: (rule) => rule.min(2000).max(2100),
    }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "client", type: "string" }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        },
      ],
    }),
    defineField({
      name: "description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "externalUrl",
      title: "External URL (optional)",
      type: "url",
    }),
    defineField({
      name: "videoUrl",
      title: "Vimeo / YouTube URL (optional)",
      type: "url",
    }),
    defineField({
      name: "videoGallery",
      title: "Video gallery",
      description:
        "Multiple videos for this project (e.g. a Before & After series). Each can have a title and short description.",
      type: "array",
      of: [
        {
          type: "object",
          name: "videoItem",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({
              name: "url",
              title: "Vimeo / YouTube URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "description", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "title", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "software",
      title: "Software used",
      description: "Software used to deliver this project.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "software" }] }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      year: "year",
      media: "coverImage",
    },
    prepare({ title, category, year, media }) {
      return {
        title,
        subtitle: [category, year].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
