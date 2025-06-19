export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
  
    const isProduction = process.env.NODE_ENV === "production";
  
    res
      .status(statusCode)
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // secure only in production
        sameSite: isProduction ? "none" : "lax", // important for cross-origin dev
        expires: new Date(
          Date.now() + (Number(process.env.COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
        ),
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
  };
  