import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";

interface LanguageSwitcherProps {
  drawer?: boolean; // Flag for drawer mode
  mode: "light" | "dark"; // Theme mode
  sx?: object; // Allow MUI styling
}

export default function LanguageSwitcher({ drawer = false, mode, sx }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();

  const handleChange = (event: any) => {
    const newLang = event.target.value as string;
    i18n.changeLanguage(newLang);
    setOpen(false);
  };

  const languageLabels: Record<string, string> = { en: "EN", sv: "SE" };

  // Define styles based on drawer and mode
  const textColor = drawer
    ? theme.palette.text.primary // Black in light mode, white in dark mode
    : theme.palette.common.white; // White for non-drawer (AppBar)

  const hoverBg = drawer
    ? mode === "dark"
      ? "rgba(255, 255, 255, 0.3)" // Brighter hover for dark mode drawer
      : "rgba(0, 0, 0, 0.05)" // Light mode drawer
    : mode === "dark"
      ? "rgba(255, 255, 255, 0.3)" // Brighter hover for dark mode non-drawer
      : theme.palette.primary.light; // Primary-bright for light mode non-drawer

      const menuBg = drawer
      ? mode === "dark"
        ? theme.palette.grey[800] // Dark gray for dark mode drawer
        : theme.palette.grey[100] // Light gray for light mode drawer
      : mode === "dark"
        ? theme.palette.grey[900] // Darker background for dark mode non-drawer
        : theme.palette.primary.light; // Match AppBar color for light mode non-drawer

  const menuTextColor = drawer
    ? theme.palette.text.primary // Black in light mode, white in dark mode
    : theme.palette.common.white; // White for non-drawer dropdown

  // Drawer button padding set to 0
  const inputPadding = drawer ? "8px !important" : "8px !important";

  return (
    <Select
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={i18n.language}
      onChange={handleChange}
      size="small"
      variant="outlined"
      IconComponent={() => null}
      sx={{
        borderRadius: "50px",
        transition: "background-color 0.3s",
        color: textColor,
        "& .MuiSelect-icon": { display: "none" },
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        "& .MuiOutlinedInput-root": {
          borderRadius: "50px !important",
          transition: "background-color 0.3s",
          color: textColor,
          "&:hover": {
            backgroundColor: hoverBg,
          },
        },
        "& .MuiOutlinedInput-input": {
          // Applies inputPadding 
          padding: inputPadding,
          textAlign: "center",
        },
        "&:hover": {
          backgroundColor: hoverBg,
        },
        ...sx, // Apply custom styles passed from parent
      }}
      renderValue={(selected) => languageLabels[selected as string] || selected}
      MenuProps={{
        PaperProps: {
          sx: {
            padding: 1,
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: menuBg,
            color: menuTextColor,
            // Dropdown hover styles for MenuItems
            "& .MuiMenuItem-root:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.3)" // Brighter hover for dark mode dropdown
                  : theme.palette.header.main, // Primary-bright for light mode dropdown
            },
          },
        },
      }}
    >
      <MenuItem value="en">{languageLabels.en}</MenuItem>
      <MenuItem value="sv">{languageLabels.sv}</MenuItem>
    </Select>
  );
}