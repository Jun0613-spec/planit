import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateInviteCode = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);

    result += characters[randomIndex];
  }

  return result;
};

export const convertSnakeCaseToTitleCase = (str: string) => {
  const titleCased = str
    .toLowerCase()
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letters of words

  // Special handling for specific status
  if (str === "IN_REVIEW") {
    return "In Review";
  } else if (str === "IN_PROGRESS") {
    return "In Progress";
  }

  return titleCased;
};
