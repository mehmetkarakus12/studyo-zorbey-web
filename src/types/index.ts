export type NavItem = {
  label: string;
  href: string;
};

export type MediaAspectRatio =
  | "portrait"
  | "landscape"
  | "square"
  | "cinematic"
  | "hero";

export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};
