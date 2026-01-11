export const errorHandler = (err, req, res, next) => {
    console.error("🔥 ERROR:", err);
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof Error) {
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
    });
};
//# sourceMappingURL=error.middleware.js.map