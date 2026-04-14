import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/**
 *  Registers a new user with the provided username, email, and password.
 *
 * @function register
 * @param {Object} userData - The user's registration data.
 * @param {string} userData.username - The user's username.
 * @param {string} userData.email - The user's email address.
 * @param {string} userData.password - The user's password.
 * @return {Promise<Object>} The response data from the server if the registration is successful.
 * @throws {Error} If the registration request fails, an error is thrown with the response data from the server.
 *
 */

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Something went wrong" };
  }
}

/**
 * Logs in a user with the provided email and password.
 *
 * @function login
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<Object>} The response data from the server if the login is successful.
 * @throws {Error} If the login request fails, an error is thrown with the response data from the server.
 */

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Something went wrong" };
  }
}

/**
 * Retrieves the currently authenticated user's information.
 *
 * @function getme
 * @returns {Promise<Object>} The response data from the server containing the user's information if the request is successful.
 * @throws {Error} If the request fails, an error is thrown with the response data from the server.
 */

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Something went wrong" };
  }
}
