/**
 * Policy to check if user is authenticated via JWT
 * Requires Authorization header with valid JWT token
 */
module.exports = async (policyContext, config, { strapi }) => {
  const { ctx } = policyContext;

  // Check for Authorization header
  const authHeader = ctx.request.headers.authorization;

  if (!authHeader) {
    return ctx.unauthorized('Missing Authorization header');
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return ctx.unauthorized('Invalid Authorization format. Expected: Bearer <token>');
  }

  try {
    // Verify the JWT token using Strapi's auth utilities
    const verified = await strapi.service('plugin::users-permissions.jwt').verify(token);
    
    // Attach user to context
    ctx.state.user = verified;
    
    return true;
  } catch (err) {
    return ctx.unauthorized('Invalid or expired token');
  }
};
