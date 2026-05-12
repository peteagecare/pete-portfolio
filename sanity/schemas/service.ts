import { defineField, defineType } from "sanity";

export const serviceSchema = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Display order on the homepage (lower first).",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title", order: "order" },
    prepare({ title, order }) {
      return { title, subtitle: `Order: ${order ?? 0}` };
    },
  },
});
