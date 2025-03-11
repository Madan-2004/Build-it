// utils/validators.js
export const isValidIITIEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@iiti\.ac\.in$/.test(email);
  };
  