export function getUserRole() {
  const data = localStorage.getItem("tebulasheet_active_user");
  if (!data) return null;

  const parsed = JSON.parse(data);
  return parsed?.role?.slug || null;
}
