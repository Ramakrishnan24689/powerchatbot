import { BrandVariants, Theme, createDarkTheme, createLightTheme } from "@fluentui/react-components";

// Powerapps purple color brand
export const powerappsBrand: BrandVariants = {
  10: "#050205",
  20: "#221221",
  30: "#3A193A",
  40: "#4E1E4E",
  50: "#632363",
  60: "#762B76",
  70: "#823C81",
  80: "#8D4D8B",
  90: "#985D96",
  100: "#A36EA0",
  110: "#AE7EAB",
  120: "#B98FB6",
  130: "#C49FC1",
  140: "#CFB0CC",
  150: "#D9C1D7",
  160: "#E4D3E3"
};

export const powerappsTheme: Theme = {
  ...createLightTheme(powerappsBrand),
};

export const powerappsdarkTheme: Theme = {
  ...createDarkTheme(powerappsBrand),
};