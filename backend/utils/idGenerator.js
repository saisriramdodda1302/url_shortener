//unique ID gen(snowflake equivalent mock)
export const generateId = () => {
    return BigInt(Date.now() * 1000 + Math.floor(Math.random() * 1000));
};
