const generateUserErrorInfo = (user) => {
    return `One or more fields were incomplete or not valid
        List of required fields:
        * email needs to be a String, received ${user.email}
        * password: needs to be a String, received: ${user.password}
    `
}

export default generateUserErrorInfo 