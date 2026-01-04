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
