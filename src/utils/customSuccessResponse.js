const ReasonStatusCode = {
    CREATED: "created",
    OK: "ok",
};

const StatusCode = {
    CREATED: 201,
    OK: 200,
};

class SuccessResponse {
    constructor(
        message,
        metadata,
        reasonStatusCode = ReasonStatusCode.OK,
        statusCode = StatusCode.OK
    ) {
        this.message = message;
        this.reasonStatusCode = reasonStatusCode;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }
    
    send = (res, header = {}) => {
        return res?.status(this.statusCode).json(this);
    };
}

class OK extends SuccessResponse {
    constructor(message, metadata) {
        super(message, metadata);
    }
}

class CREATED extends SuccessResponse {
    constructor(
        message,
        metadata,
        reasonStatusCode = ReasonStatusCode.CREATED,
        statusCode = StatusCode.CREATED
    ) {
        super(message, metadata);
        this.reasonStatusCode = reasonStatusCode;
        this.statusCode = statusCode;
    }
}

module.exports = { OK, CREATED };
