import dayjs from "dayjs";
import { convertUtcToLocal } from "./timezone";

export const formatDate = (date, format = "YYYY-MM-DD") => {
  if (!date) return "";
  return dayjs(date).format(format);
};

export const formatDateTime = (date, format = "YYYY-MM-DD HH:mm") => {
  if (!date) return "";
  return dayjs(date).format(format);
};

export const formatTime = (date, format = "HH:mm") => {
  if (!date) return "";
  return dayjs(date).format(format);
};

export const formatDateTurkish = (date, format = "D MMMM YYYY") => {
  if (!date) return "";
  const localDate = convertUtcToLocal(date);
  if (!localDate || !localDate.isValid()) return "";
  return localDate.locale("tr").format(format);
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    return null;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};
