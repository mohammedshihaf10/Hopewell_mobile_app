export const ICONS = {
  // Tabs
  "person.fill": true,
  "bell.fill": true,
  "qrcode": true,
  "clock.fill": true,
  "bag.fill": true,
  "filter.fill": true,
  "charger.fill": true,

  // Common
  "house.fill": true,
  "paperplane.fill": true,
  "chevron.right": true,
  "map.fill": true,
  "location.fill": true,
  "arrow.left": true,
  "arrow.right": true,
  "xmark": true,
  "checkmark": true,
  "plus": true,
  "minus": true,
  "pencil": true,
  "trash.fill": true,
  "gearshape.fill": true,
  "creditcard.fill": true,
  "wallet.pass.fill": true,
  "chart.bar.fill": true,
  "bell.slash.fill": true,
} as const;

export type IconName = keyof typeof ICONS;
