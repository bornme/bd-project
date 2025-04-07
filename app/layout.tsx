import "./globals.css";
import { Barriecito, Roboto } from "next/font/google";

const barriecito = Barriecito({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-barriecito",
});

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Birthday Timeline",
  description: "A romantic birthday timeline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${barriecito.className} ${roboto.variable}`}>
        {children}
      </body>
    </html>
  );
}