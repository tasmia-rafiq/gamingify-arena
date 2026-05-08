export const tokenCookieOptions = (time) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: time,
  };
  
  return options;
};