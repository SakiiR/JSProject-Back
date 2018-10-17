async function isAuthenticated(ctx) {
  return !(ctx.state.user == null);
}

export { isAuthenticated };
