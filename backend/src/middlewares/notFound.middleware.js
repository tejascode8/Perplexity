export const notFoundFallback = (req, res) => {
  const isApiRequest =
    req.originalUrl.startsWith("/api") ||
    req.xhr ||
    req.headers.accept?.includes("application/json");

  if (isApiRequest) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: `API endpoint ${req.originalUrl} not found or unauthorized`,
    });
  }

  // Redirect any unknown web or general calls to dashboard
  const frontendUrl = process.env.FRONTEND_URL || "/";
  return res.redirect(frontendUrl);
};
