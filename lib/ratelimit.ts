import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis is configured
const isRedisConfigured = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Create Redis instance only if configured
const redis = isRedisConfigured
    ? Redis.fromEnv()
    : null;

// Create a new ratelimiter that allows 10 requests per 10 seconds for messages
export const messageRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit/message",
}) : null;

// Create a new ratelimiter that allows 5 requests per 10 seconds for posts
export const postRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit/post",
}) : null;

// Create a new ratelimiter that allows 20 requests per 10 seconds for AI suggestions
export const aiRatelimit = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit/ai",
}) : null;

// Helper function to check rate limit with fallback
export async function checkRateLimit(
    limiter: Ratelimit | null,
    identifier: string
): Promise<{ success: boolean }> {
    if (!limiter) {
        // If rate limiting is not configured, allow all requests
        console.warn("Rate limiting is not configured. Skipping rate limit check.");
        return { success: true };
    }

    return await limiter.limit(identifier);
}
