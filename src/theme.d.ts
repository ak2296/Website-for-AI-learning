import { Palette, PaletteOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    header: {
      main: string;
    };
    footer: {
      main: string;
    };
  }
  interface PaletteOptions {
    header?: {
      main: string;
    };
    footer?: {
      main: string;
    };
  }
}