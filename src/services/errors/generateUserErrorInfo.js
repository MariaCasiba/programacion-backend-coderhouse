const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid
        List of required properties:
        * first_name needs to be a String, received ${user.first_name}
        * email: needs to be a String, received: ${user.email}
        * password: needs to be a String, received: ${user.password}
    `
}

export default generateUserErrorInfo 