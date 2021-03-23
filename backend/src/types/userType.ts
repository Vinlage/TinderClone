import { Document } from "mongoose"

export interface ICreateUser extends Document{
    user: string,
    password: string,
    passwordConfirm: string
}

export interface ILogin extends Document{
    user: string,
    password: string
}

export interface IProfile extends Document{
    userId: string,
    name: string,
    description: string,
    local: string
}

