import sha512 from "js-sha512";

export const generateSalt = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};

export const hashPassword = password => {
  const hash = sha512(password).toString("hex");
  return hash;
};

export const compareHash = (password, hash) => {
  return hashPassword(password) === hash;
};
