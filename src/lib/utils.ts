import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(str: string) {
  return str.replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9-_]/g, "_");
}
