import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" — все пути к файлам относительные.
// Поэтому сайт работает при ЛЮБОМ имени репозитория, например
// https://<логин>.github.io/dateinvitation1/ — ничего менять не нужно.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
