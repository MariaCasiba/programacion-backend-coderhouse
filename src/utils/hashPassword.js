import bcrypt from "bcrypt";

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));


export const isValidPassword = (password, user) => {

    if (!user || !password) {
        console.log("Contraseña o usuario no proporcionado");
        return false;
    }

    if (user.role === "admin") {
        return true;
    }

    return bcrypt.compareSync(password, user.password);
};