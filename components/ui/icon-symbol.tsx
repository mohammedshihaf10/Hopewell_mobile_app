import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

import { IconName } from "./icon-names";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

const MAPPING: Record<IconName, MaterialIconName> = {
  "person.fill": "person",
  "bell.fill": "notifications",
  "qrcode": "qr-code",
  "clock.fill": "access-time",
  "bag.fill": "shopping-bag",
  "filter.fill": "filter-alt",
  "charger.fill": "ev-station",
  "map.fill": "map",
  "xmark": "close",
  "search": "search",
  "directions": "directions",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "arrow.left": "arrow-back",
  "arrow.right": "arrow-forward",
  "plus": "add",
  "phone": "phone",
  "email": "email",
  "description": "description",
  "policy": "policy",
  "help": "help-outline",
  "gift.fill": "card-giftcard",
  "bolt.fill": "bolt",

  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.right": "chevron-right",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <MaterialIcons
      name={MAPPING[name]}
      size={size}
      color={color}
      style={style}
    />
  );
}
