local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

-- Remove expired entries
redis.call("ZREMRANGEBYSCORE", key, 0, now - window)

-- Count current requests
local count = redis.call("ZCARD", key)

if count < limit then
    redis.call("ZADD", key, now, tostring(now))
    redis.call("EXPIRE", key, math.ceil(window / 1000))
    return {1, limit - count - 1}
else
    return {0, 0}
end
