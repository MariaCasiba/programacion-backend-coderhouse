
class CustomError {
    static createError({name='Error', cause, message, code=1}){
        let error = new Error(message)

        error.name = name
        error.cause = cause
        error.code = code

        throw error
    }
} 


/*
class CustomError extends Error {
    constructor({ name = 'Error', cause, message, code = 1 }) {
        super(message);
        this.name = name;
        this.cause = cause;
        this.code = code;
    }

    static createError(params) {
        return new CustomError(params);
    }
}
*/

export default CustomError