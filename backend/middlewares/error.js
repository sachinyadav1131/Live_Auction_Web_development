class Errorhandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const errorMiddleware=(err,req,res,next)=>{
  err.message=err.message || "Internal server error.";
  err.statusCode=err.statusCode || 500;


  if(err.name=== "JsonWebTokenError") {
    const message="Json web token is invalid";
    err=new Errorhandler(message,400);
  }

  if(err.name=== "TokenExpiredError") {
    const message="Json web token is expired";
    err=new Errorhandler(message,400);
  }

  if(err.name=== "CastError") {
    const message=`Invalid ${err.path}`;
    err=new Errorhandler(message,400);
  }

  const errorMessage=err.errorMessage
  ? Object.values(err.error)
      .map((error) => error.message)
      .join(" ")
      :err.message;

   return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
}

export default Errorhandler;