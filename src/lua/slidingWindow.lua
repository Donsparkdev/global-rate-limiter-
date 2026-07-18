local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

redis.call("ZREMRANGEBYSCORE", key, 0, now - window)

local current = redis.call("ZCARD", key)

if current < limit then
    redis.call("ZADD", key, now, tostring(now))
    redis.call("EXPIRE", key, math.ceil(window / 1000))
    return {1, limit - current - 1}
end

return {0, 0}
