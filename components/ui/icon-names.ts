export const ICONS = {
  // Tabs
  "person.fill": true,
  "bell.fill": true,
  "qrcode": true,
  "clock.fill": true,
  "bag.fill": true,

  // Common
  "house.fill": true,
  "paperplane.fill": true,
  "chevron.right": true,
} as const;

export type IconName = keyof typeof ICONS;
