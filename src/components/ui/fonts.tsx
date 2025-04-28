import {
  Lexend_Deca,
  Geist as GeistFont,
  Geist_Mono as GeistMonoFont,
  Open_Sans as OpenSansFont,
} from "next/font/google";

export const LexendDeca = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-lexend-deca",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Geist = GeistFont({
  subsets: ["latin"],
  variable: "--font-geist",
});

const GeistMono = GeistMonoFont({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const OpenSans = OpenSansFont({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const fontVariables = `${LexendDeca.variable} ${Geist.variable} ${GeistMono.variable} ${OpenSans.variable}`;
