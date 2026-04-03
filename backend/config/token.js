import jwt from "jsonwebtoken";

const genToken = (userId) => {
  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);  // ← ye add karo
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
    console.log("Token created");  // ← ye add karo
    return token;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default genToken;