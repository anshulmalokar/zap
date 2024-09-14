import jsonwebtoken from "jsonwebtoken";

export class TokenManager{
  public static async generateToken(userId: number){
    const token = await jsonwebtoken.sign(
      { userId },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "15d",
      }
    );
    return token;
  }

  public static async decodeToken(token: string){
    try {
      const decodedToken = await jsonwebtoken.decode(token);
      if(!decodedToken){
        throw new Error("Invalid token passed");
      }
      return decodedToken;
    }catch(e){
      console.log(e);
      return "";
    }
  }

  public static async validateToken(token: string):Promise<boolean>{
    try{
      const validate = await jsonwebtoken.verify(token,process.env.JWT_SECRET as string);
      if(validate){
        return true;
      }
    }catch(e){
      return false
    }
    return false;
  }
}