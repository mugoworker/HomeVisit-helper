<div# 家訪照片排版助手 (HomeVisit Helper)

這是一個協助社工或相關人員快速整理家訪照片並生成 PDF 排版的工具。

## 功能特色

- 📸 **照片上傳與預覽**：支援多張照片上傳。
- 📝 **文字描述**：可為每張照片添加說明。
- 🤖 **AI 輔助**：整合 Google Gemini API，自動生成照片描述（需設定 API Key）。
- 📄 **PDF 匯出**：一鍵將整理好的圖文內容匯出為 PDF 文件。
- 📱 **響應式設計**：支援桌面與行動裝置操作。

## 專案設定 (Setup)

### 前置需求

- Node.js (建議 v18 或以上)
- npm 或 yarn

### 安裝依賴

```bash
npm install
# 或
yarn install
```

### 開發模式 (Development)

啟動本地開發伺服器：

```bash
npm run dev
```

### 建置專案 (Build)

打包生產環境檔案：

```bash
npm run build
```

打包後的檔案位於 `dist` 資料夾。

### 部署 (Deployment)

本專案已設定 GitHub Actions，推送到 `main` 分支時會自動部署至 GitHub Pages。

若需手動部署：

1. 確保 `vite.config.ts` 中的 `base` 設定正確（通常為 `/repo-name/`）。
2. 執行 `npm run build`。
3. 將 `dist` 資料夾內容上傳至伺服器。

## 環境變數

若要使用 AI 描述生成功能，請建立 `.env` 檔案並設定：

```env
GEMINI_API_KEY=你的_GEMINI_API_KEY
```
