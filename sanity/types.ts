import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImage } from "./lib/image";

export type ProjectCategory = "photo" | "video" | "web" | "design";

export type ProjectSummary = {
  _id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  year?: number;
  role?: string;
  client?: string;
  coverImage?: SanityImage;
  cvCompanies?: string[];
};

export type VideoItem = {
  title?: string;
  url: string;
  description?: string;
};

export type Project = ProjectSummary & {
  description?: PortableTextBlock[];
  externalUrl?: string;
  videoUrl?: string;
  videoGallery?: VideoItem[];
  gallery?: SanityImage[];
  software?: { _id: string; name: string }[];
};

export type Software = {
  _id: string;
  name: string;
  cvCompanies?: string[];
  order?: number;
  projects?: ProjectSummary[];
};

export type Service = {
  _id: string;
  title: string;
  description: string;
  order: number;
};

export type EquipmentCategory =
  | "camera"
  | "lens"
  | "support"
  | "audio"
  | "lighting"
  | "accessory";

export type Equipment = {
  _id: string;
  name: string;
  brand?: string;
  description?: string;
  quantity?: number;
  category: EquipmentCategory;
  order?: number;
  image?: SanityImage;
};

export type EquipmentByCategory = {
  camera: Equipment[];
  lens: Equipment[];
  support: Equipment[];
  audio: Equipment[];
  lighting: Equipment[];
  accessory: Equipment[];
};

export type JournalPostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  coverImage?: SanityImage;
};

export type JournalPost = JournalPostSummary & {
  body?: PortableTextBlock[];
};

export type SocialLink = { platform: string; url: string };

export type SiteSettings = {
  name?: string;
  tagline?: string;
  heroImage?: SanityImage;
  aboutText?: PortableTextBlock[];
  headshot?: SanityImage;
  contactEmail?: string;
  socialLinks?: SocialLink[];
  currentRoleText?: string;
};
