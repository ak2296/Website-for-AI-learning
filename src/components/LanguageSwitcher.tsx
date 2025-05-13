import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

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

  const languageLabels: Record<string, { flag: string }> = {
    en: { flag: "/flags/en.png" },
    sv: { flag: "/flags/se.png" },
  };

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
      : theme.palette.primary.light; // Primary-bright for light mode non-drawer

  const menuTextColor = drawer
    ? theme.palette.text.primary // Black in light mode, white in dark mode
    : theme.palette.common.white; // White for non-drawer dropdown

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
        borderRadius: "50%",
        transition: "background-color 0.3s",
        color: textColor,
        "& .MuiSelect-icon": { display: "none" },
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        "& .MuiOutlinedInput-root": {
          borderRadius: "50% !important",
          transition: "background-color 0.3s",
          color: textColor,
          "&:hover": {
            backgroundColor: hoverBg,
          },
          
        },
        "& .MuiOutlinedInput-input": {
          padding: inputPadding,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        "&:hover": {
          backgroundColor: hoverBg,
        },
        ...sx, // Apply custom styles passed from parent
      }}
      renderValue={(selected) =>
        languageLabels[selected as string] ? (
          <Box
            component="img"
            src={languageLabels[selected as string].flag}
            alt={`${selected} flag`}
            sx={{ width: "20px", height: "15px",px:0.25 }}
          />
        ) : (
          selected
        )
      }
      MenuProps={{
        PaperProps: {
          sx: {
            padding: 1,
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: menuBg,
            color: menuTextColor,
            "& .MuiMenuItem-root": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .MuiMenuItem-root:hover": {
              // CHANGE HERE: Use primary.light for drawer light mode
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.3)" // Brighter hover for dark mode
                  : drawer
                    ? theme.palette.primary.light // Primary-bright for light mode drawer
                    : theme.palette.header.main, // Header color for light mode non-drawer
            },
          },
        },
      }}
    >
      <MenuItem value="en">
        <Box
          component="img"
          src={languageLabels.en.flag}
          alt="EN flag"
          sx={{ width: "30px", height: "20px" }}
        />
      </MenuItem>
      <MenuItem value="sv">
        <Box
          component="img"
          src={languageLabels.sv.flag}
          alt="SE flag"
          sx={{ width: "30px", height: "20px" }}
        />
      </MenuItem>
    </Select>
  );
}