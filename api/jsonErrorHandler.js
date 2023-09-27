// jsonErrorHandler.js

function jsonErrorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Handle JSON parsing error
    res.status(400).json({ error: "Invalid JSON" });
  } else {
    next();
  }
}

export default jsonErrorHandler;
