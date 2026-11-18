import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Check if user has an active local or demo session
  const sessionCookie = request.cookies.get("fintrack-session");
  let hasLocalSession = false;
  if (sessionCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (parsed && (parsed.email || parsed.isDemo)) {
        hasLocalSession = true;
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  const pathname = request.nextUrl.pathname;

  if (hasLocalSession) {
    if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (
      !user &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/signup")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (
      user &&
      (pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup"))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch {
    // If Supabase server request fails (e.g. backend paused / network down)
    if (!pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }
}
