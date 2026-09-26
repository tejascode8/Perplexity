import { useDispatch } from "react-redux";
import { register, login, getMe, logout as apiLogout } from "../service/auth.api.js";
import { setUser, setLoading, setError, logoutUser } from "../auth.slice.js";
import { resetChatState } from "../../chat/chat.slice.js";

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
      const registrationData = await register({ email, username, password });
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
      return data.user;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Login failed";
      dispatch(setError(errMsg));
      throw error;
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
      const isAuthError =
        error.message?.includes("token") ||
        error.message === "Unauthorized" ||
        error.err?.includes("token") ||
        error.message?.includes("Unauthorized");
      if (!isAuthError) {
        dispatch(setError(error.message || "Failed to fetch user data"));
      }
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }

  /**
   * Logs out the user and clears state.
   * @function handleLogout
   */
  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await apiLogout();
      dispatch(logoutUser());
      dispatch(resetChatState());
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logoutUser());
      dispatch(resetChatState());
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
}
