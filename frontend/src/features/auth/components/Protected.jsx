import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useTheme } from "../../../app/theme.context";
import { UniversalLoader } from "../../../app/components/UniversalLoader";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const { isDark } = useTheme();

  if (loading) {
    return <UniversalLoader text="Perplexity" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
