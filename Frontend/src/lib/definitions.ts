import { JwtPayload } from "jwt-decode";
import { DefaultSession, Profile } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

export interface CustomJwtPayload extends JwtPayload {
    nameid: string;
    unique_name: string;
    email: string;
}

export interface IToken extends DefaultJWT {
    token: string;
}

export interface SessionWithId extends DefaultSession {
    user: {
        id: number | string;
        token: string;
        image?: string;
    } & DefaultSession["user"];
}

export interface IUser {
    id?: number,
    name: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    image?: string,
    id_provider?: string
}

export interface IProfile extends Profile {
    id: number;
    token: string;
    picture: string;
}

export interface IResponse {
    token: string;
    result: boolean;
}

export interface IJWT extends DefaultJWT {
    image?: string
}