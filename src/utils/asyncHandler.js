const asyncHandler = (requestHandler) => {
    // Return an async middleware function that wraps the request handler
    return (req, res, next) => {
        // Make sure the request handler returns a promise
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err)); // If the request handler throws an error, pass it to the next error handler
    };
};

export { asyncHandler };

