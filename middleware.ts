/**
 * Auth boundary.
 *
 * SCOPE IS DELIBERATELY NARROW. The public layer is the growth engine —
 * county / operator / well / owner pages, statically generated and served
 * from the edge cache. Running auth over those routes would attach a
 * per-request session cookie to pages that are meant to be identical for
 * every visitor and for Googlebot, which defeats their caching. So the
 * matcher below lists the private surfaces explicitly rather than matching
 * everything and carving exceptions out: a new public page is public by
 * default, and only a deliberate edit can put it behind the wall.
 *
 * `/api/demo-*` is intentionally NOT protected — those routes are already
 * disabled outside development (see their own guard).
 */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPrivate = createRouteMatcher(["/app(.*)", "/onboarding(.*)", "/api/app(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Deliberately NOT calling auth.protect() here.
  //
  // On a development instance Clerk needs its browser-handshake token before
  // it can resolve auth state, and protect() answers a client that lacks one
  // (curl, an uptime probe, a crawler) with an opaque 404 rewrite rather than
  // a redirect — x-clerk-auth-reason: dev-browser-missing. Verified against
  // the production build.
  //
  // The gate that actually runs is in app/app/layout.tsx: `force-dynamic`,
  // reads auth(), and redirects to /login. App Router guarantees that layout
  // wraps every page in the segment, so there is no page under /app it can
  // miss. This middleware's job is to attach the auth context those pages
  // read — which is why the matcher still has to cover them.
  if (isPrivate(req)) {
    // touch auth so the context is resolved for the request
    await auth();
  }
});

export const config = {
  matcher: [
    // the authed application
    "/app/:path*",
    // claim attach (post-signup) and the authed claim APIs
    "/onboarding/:path*",
    "/api/app/:path*",
    // sign-in / sign-up need Clerk context to render and to complete a flow
    "/login/:path*",
    "/signup/:path*",
  ],
};
