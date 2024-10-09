"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Material UIのカラー変更を全体に適用するコンポーネント
// プロパティとして、children(Reactの子コンポーネント)を受け取る
// Themaは紫色!!
export function Thema({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#8b5cf6",
      },
      success: {
        main: "#22c55e",
        contrastText: "#FFFFFF",
      },
      error: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
      background: {
        default: "#FFFFFF",
      },
      secondary: {
        main: "#FFFFFF",
        contrastText: "#FFFFFF",
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
