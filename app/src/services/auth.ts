import { Credentials } from "@/components/LoginForm";

const AUTH_URL = "http://localhost:8080/auth";

export const signup = async (credentials: Credentials) => {
  try {
    const response = await fetch(`${AUTH_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const body = await response.json();
    return body;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const signin = async (credentials: Credentials) => {
  try {
    const response = await fetch(`${AUTH_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const body = await response.json();
    return body;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const logout = async (token: string) => {
  try {
    const response = await fetch(`${AUTH_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const sendPasswordResetRequest = async (email: string) => {
  try {
    const response = await fetch(`${AUTH_URL}/forgot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const body = await response.json();
    return body;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const checkResetTokenValidity = async (resetToken: string) => {
  try {
    const response = await fetch(`${AUTH_URL}/reset?resetToken=${resetToken}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const body = await response.json();
    return body;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const resetPassword = async (password: string, resetToken: string) => {
  try {
    const response = await fetch(`${AUTH_URL}/reset?resetToken=${resetToken}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};
