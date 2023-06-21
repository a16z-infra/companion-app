import { authMiddleware } from "@clerk/nextjs";

// This requires user to sign in to see any page or call any API route
export default authMiddleware();

// Use the following code instead to expose /api or / as public routes 
// export default authMiddleware({
//   publicRoutes: ["/", "/api(.*)"],
// });

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
