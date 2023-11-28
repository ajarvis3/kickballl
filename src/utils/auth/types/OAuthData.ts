interface IUserToken {
   iss: string;
   nbf: number;
   aud: string;
   sub: string;
   email: string;
   azp: string;
   name: string;
   picture: string;
   given_name: string;
   iat: number;
   exp: number;
   jti: string;
}

export default IUserToken;
