// src/components/LanguageSwitcher.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


interface LanguageSwitcherProps {
  drawer?: boolean; // Flag for drawer mode
  sx?: object; // Allow MUI styling
}

export default function LanguageSwitcher({ drawer = false, sx }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (event: any) => {
    const newLang = event.target.value as string;
    i18n.changeLanguage(newLang);
    setOpen(false);
  };

  const languageLabels: Record<string, string> = { en: "EN", sv: "SE" };

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
        borderRadius: "50px", // Default styles
        transition: "background-color 0.3s", 
        color: drawer ? "black" : "white",
        "& .MuiSelect-icon": { display: "none" },
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        "& .MuiOutlinedInput-root": {
          borderRadius: "50px !important",
          transition: "background-color 0.3s",
          color: drawer ? "black" : "white",
          "&:hover": {
            backgroundColor: drawer
            ? "rgba(0, 0, 0, 0.06)" // Light hover for drawer
            : "rgba(255, 255, 255, 0.15)", // Dark hover for non-drawer
          },
        },
        "& .MuiOutlinedInput-input": {
          padding: "8px 8px 8px 8px !important",
          textAlign: "center",
        },

        "&:hover": {
          backgroundColor: drawer
            ? "rgba(0, 0, 0, 0.06)" // Light hover for drawer
            : "rgba(255, 255, 255, 0.15)", // Dark hover for non-drawer
        },
        ...sx, // Apply custom styles passed from parent
      }}
      renderValue={(selected) => languageLabels[selected as string] || selected}
    >
      <MenuItem value="en">{languageLabels.en}</MenuItem>
      <MenuItem value="sv">{languageLabels.sv}</MenuItem>
    </Select>
  );
}
