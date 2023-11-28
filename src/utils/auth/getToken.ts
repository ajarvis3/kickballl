const getToken = (str: string) => {
   const bearer = str.split(" ");
   bearer[1] = bearer[1].replace(/\"/g, "");
   console.log(bearer[1]);
   return bearer[1];
};

export default getToken;
