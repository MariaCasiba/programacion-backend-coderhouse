// data transfer object

class UserDto {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
        this.cartId = user.cartId
    }
}

export default UserDto