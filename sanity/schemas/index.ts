import type { SchemaTypeDefinition } from "sanity";
import { projectSchema } from "./project";
import { serviceSchema } from "./service";
import { siteSettingsSchema } from "./siteSettings";
import { equipmentSchema } from "./equipment";
import { softwareSchema } from "./software";
import { educationSchema } from "./education";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettingsSchema,
  projectSchema,
  serviceSchema,
  equipmentSchema,
  softwareSchema,
  educationSchema,
];
