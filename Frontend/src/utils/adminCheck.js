export const isAdmin = (userEmail) => {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
  const councilHeads = import.meta.env.VITE_COUNCIL_HEADS?.split(',') || [];
  return adminEmails.includes(userEmail) || councilHeads.includes(userEmail);
};