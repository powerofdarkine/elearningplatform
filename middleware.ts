import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Allow anyone to see the landing page AND the sign-in/up pages
  publicRoutes: ["/sign-in(.*)", "/sign-up(.*)"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};