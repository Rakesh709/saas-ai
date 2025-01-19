import { clerkMiddleware,createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware(async (auth,req)=>{
    //const userId = auth();
    const {userId} = await auth();
    const currentUrl = new URL(req.url)
    const isAccessingDashboard= currentUrl.pathname ==="/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")

     // If user is logged in and accessing a public route but not the dashboard
    if(userId && isPublicRoute(req) && !isAccessingDashboard){
      return NextResponse.redirect(new URL("/home",req.url))
    }
    //not a part of login or not on home page if not route to home page for video play 

    //not logged in
    if(!userId){
      //if user is not logged in and trying to access a protected route
      if(!isPublicApiRoute(req) && !isPublicRoute(req)){
        return NextResponse.redirect(new URL("/sign-in",req.url))
      }

      //if the request is for a protected API and the user is not logged in
      if(isApiRequest && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in",req.url))
      }
    }

    return NextResponse.next()
    //becaouse of this middleware 




});

export const config = {
 matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

