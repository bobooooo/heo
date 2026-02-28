import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "互相帮助 · 社区互助广场",
  description: "邻里互助的响应式 Web MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
