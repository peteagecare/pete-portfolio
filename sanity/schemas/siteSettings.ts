import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      initialValue: "Pete Jenkins",
    }),
    defineField({
      name: "tagline",
      type: "string",
      description: "Short italic line on the homepage intro band.",
    }),
    defineField({
      name: "currentRoleText",
      title: "Current role text",
      type: "string",
      description:
        "Short context line about your day job — appears on About and footer-area copy.",
    }),
    defineField({
      name: "heroImage",
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
      name: "headshot",
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
      name: "aboutText",
      title: "About text",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "contactEmail",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Flickr", value: "flickr" },
                  { title: "Vimeo", value: "vimeo" },
                  { title: "YouTube", value: "youtube" },
                  { title: "X (Twitter)", value: "twitter" },
                ],
              },
            }),
            defineField({
              name: "url",
              type: "url",
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
