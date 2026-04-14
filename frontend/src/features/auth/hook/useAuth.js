import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api.js";
import { setUser, setLoading, setError } from "../auth.slice.js";

/**
 * Custom hook for handling authentication-related actions such as registration, login, and fetching the current user's information.
 *
 * @function useAuth
 * @returns {Object} An object containing the authentication functions.
 */
export function useAuth() {
  const dispatch = useDispatch();

  /**
   * Registers a new user with the provided email, username, and password.
   * @function handleRegister
   */

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true));

      // Register user
      const registrationData = await register({ email, username, password });

      // Don't auto-login because email needs verification
      // Return registration data for success handling
      return registrationData;
    } catch (error) {
      dispatch(setError(error.message || "Registration failed"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  /**
   * Logs in a user with the provided email and password.
   * @function handleLogin
   */

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  /**
   * Fetches the currently authenticated user's information and updates the Redux store with the user data.
   * @function handleGetMe
   */

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      // Don't treat "not logged in" as a real error
      const isAuthError =
        error.message?.includes("token") ||
        error.message === "Unauthorized" ||
        error.err?.includes("token") ||
        error.message?.includes("Unauthorized");
      if (!isAuthError) {
        dispatch(setError(error.message || "Failed to fetch user data"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
  };
}
