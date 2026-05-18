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
          { title: "Social", value: "social" },
          { title: "Videography", value: "video" },
          { title: "Photography", value: "photo" },
          { title: "Design", value: "design" },
          { title: "Web", value: "web" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "videoOrientation",
      title: "Video orientation",
      description:
        "Horizontal (16:9) for landscape video, vertical (9:16) for Reels / TikTok / shorts.",
      type: "string",
      options: {
        list: [
          { title: "Horizontal (16:9)", value: "horizontal" },
          { title: "Vertical (9:16)", value: "vertical" },
        ],
        layout: "radio",
      },
      initialValue: "horizontal",
      hidden: ({ document }) =>
        document?.category !== "video" && document?.category !== "social",
    }),
    defineField({
      name: "thumbnailOrientation",
      title: "Thumbnail orientation",
      description:
        "Controls how the project card renders in grids. Use portrait for vertical / social work.",
      type: "string",
      options: {
        list: [
          { title: "Landscape (16:9)", value: "landscape" },
          { title: "Portrait (9:16)", value: "portrait" },
          { title: "Square (1:1)", value: "square" },
        ],
        layout: "radio",
      },
      initialValue: "landscape",
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featuredOrder",
      title: "Homepage order (optional)",
      description:
        "Pin this project near the top of the homepage Recent Projects grid. Lower numbers appear first (1, 2, 3...). Leave blank to sort by year as normal.",
      type: "number",
      validation: (rule) => rule.integer().min(1),
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
