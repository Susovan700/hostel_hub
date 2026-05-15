const BASE_URL = "http://127.0.0.1:5000/api";

export const apiRequest = async (
  endpoint,
  method = "GET",
  data = null
) => {

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };

  const config = {
    method,
    headers,
    ...(data && {
      body: JSON.stringify(data),
    }),
  };

  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    config
  );

  const result = await response.json();

  if (!response.ok) {
    return Promise.reject({
      message:
        result.error ||
        "Something went wrong",
    });
  }

  return result;
};