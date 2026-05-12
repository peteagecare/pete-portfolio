import { defineField, defineType } from "sanity";

export const softwareSchema = defineType({
  name: "software",
  title: "Software",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cvCompanies",
      title: "Used at",
      description:
        "Tick which CV company/employer used this software. Drives the /software page grouping.",
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
      name: "order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
