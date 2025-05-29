/**
 * MUIテーマプロバイダー
 * @fileoverview アプリ全体にMUIテーマを提供するコンポーネント
 */

import React from "react"
import {ThemeProvider as MuiThemeProvider, createTheme} from "@mui/material/styles"
import {CssBaseline} from "@mui/material"
import type {ReactNode} from "react"

/**
 * カスタムテーマの定義
 */
const theme = createTheme({
  palette: {
    primary: {
      main: "#005f73", // Teal dark - アプリのメインカラー
      light: "#0a9396", // Teal medium
      dark: "#003d4f", // Teal darker
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ee9b00", // Orange - アクセントカラー
      light: "#f9c74f", // Yellow orange
      dark: "#ca6702", // Dark orange
      contrastText: "#000000",
    },
    background: {
      default: "#f4f7f6", // Light gray green
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
    error: {
      main: "#d32f2f", // Red
      light: "#ef5350",
      dark: "#c62828",
    },
    warning: {
      main: "#ed6c02", // Orange
      light: "#ff9800",
      dark: "#e65100",
    },
    success: {
      main: "#2e7d32", // Green
      light: "#4caf50",
      dark: "#1b5e20",
    },
    info: {
      main: "#0288d1", // Blue
      light: "#03a9f4",
      dark: "#01579b",
    },
  },
  typography: {
    fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(
      ",",
    ),
    h1: {
      fontWeight: 600,
      fontSize: "1.8rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.3rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.1rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 600,
      textTransform: "none", // ボタンテキストを小文字に変換しない
    },
  },
  spacing: 8, // 基本の間隔単位（8px）
  shape: {
    borderRadius: 8, // 角の丸み
  },
  components: {
    // MuiButtonのカスタマイズ
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 20px",
          fontSize: "1rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    // MuiTextFieldのカスタマイズ
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0a9396",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#005f73",
              borderWidth: "2px",
            },
          },
        },
      },
    },
    // MuiPaperのカスタマイズ
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
})

/**
 * ThemeProviderコンポーネントのプロパティ
 */
interface ThemeProviderProps {
  /** 子コンポーネント */
  children: ReactNode
}

/**
 * ThemeProviderコンポーネント
 * @description アプリ全体にMUIテーマとCSSベースラインを提供
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
