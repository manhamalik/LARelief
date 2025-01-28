import { NextResponse } from "next/server";

export async function middleware(req) {
	const { pathname } = req.nextUrl;

	const shopRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/shop-page-enabling`
	);
	const isShopEnables = await shopRes.json();
	if (shopRes.ok) {
		if (isShopEnables.data.isShopEnabled) {
			return NextResponse.next();
		} else {
			return NextResponse.redirect(new URL("/", req.url));
		}
	} else {
		return NextResponse.redirect(new URL("/", req.url));
	}
}

export const config = {
	matcher: ["/shop/:path*"], // Optional, can comment out to apply globally
};

export const rateLimit = (req, res, next) => {
	const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	const currentTime = Date.now();
	const limit = 5; // Number of allowed requests
	const timeWindow = 60 * 1000; // Time window in milliseconds (1 minute)

	// Initialize the rate limit map if it doesn't exist
	if (!global.rateLimitMap) {
		global.rateLimitMap = {};
	}

	// Check if the IP exists in the rate limit map
	if (!global.rateLimitMap[ip]) {
		global.rateLimitMap[ip] = {
			count: 1,
			startTime: currentTime,
		};
	} else {
		// Check if the time window has passed
		if (currentTime - global.rateLimitMap[ip].startTime < timeWindow) {
			// Within the time window, increment the count
			global.rateLimitMap[ip].count++;

			// Check if the limit has been exceeded
			if (global.rateLimitMap[ip].count > limit) {
				return res
					.status(429)
					.json({ message: "Too many requests, please try again later." });
			}
		} else {
			// Time window has passed, reset the count and start time
			global.rateLimitMap[ip] = {
				count: 1,
				startTime: currentTime,
			};
		}
	}

	next();
};

export default rateLimit;
