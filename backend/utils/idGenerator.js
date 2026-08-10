//unique ID gen(snowflake equivalent mock)
export const generateId = () => {
    return BigInt(Date.now() * 1000 + Math.floor(Math.random() * 1000));
};


//The Flaw in our LogicDate.now() only changes once every millisecond.
//If our server processes more than 1,000 requests per millisecond, the Math.floor(Math.random() * 1000) pool runs out of unique numbers.

//Anatomy of a crct Snowflake ID
//The standard 64-bit structure of a Snowflake ID is split into specific segments:
//1 Sign Bit: Always set to 0 to keep the resulting integer positive.
//41 Timestamp Bits: Milliseconds elapsed since a custom epoch, ensuring chronological sorting and a lifespan of roughly 69 years.
//10 Machine/Node Bits: Identifies the specific datacenter (5 bits) and machine/worker (5 bits) to prevent cross-server collisions.
//12 Sequence Bits: An intra-millisecond counter that allows a single server node to safely generate up to 4,096 unique IDs per millisecond