import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { signIn } from "next-auth/react"
import { jwtDecode } from 'jwt-decode'
import { Account, NextAuthOptions, Profile, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import { CustomJwtPayload, IUser } from "./definitions"
import { AdapterUser } from "next-auth/adapters"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface GoogleProfile extends Profile {
  picture?: string;  // Añades la propiedad picture que viene de Google
}

export async function createUser(user : IUser) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authentication/register`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" }
  });
  if(!res.ok){
    throw new Error(`${res.status} ${res.statusText}`)
  }
  const data = await res.json();
  const decodedToken = jwtDecode<CustomJwtPayload>(data.token)
  console.log("---USUARIO CREADO---")
  return {
    id: decodedToken.nameid,
    name: decodedToken.unique_name,
    email: decodedToken.email,
    token: data.token
  }
}

export async function loginUser(username : string, password : string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authentication/login`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Error: ${res.statusText}`)
  }

  const data = await res.json()
  const decodedToken = jwtDecode<CustomJwtPayload>(data.token)
  return {
    id: decodedToken.nameid,
    name: decodedToken.unique_name,
    email: decodedToken.email,
    token: data.token
  }
}

export const authOptions : NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = await loginUser(credentials!.username, credentials!.password)
        return result;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile } : { token: JWT, user: User | AdapterUser, account: Account | null, profile?: GoogleProfile }) {
      if(user) {
        if(account?.provider === "google"){
          console.log("---GOOGLE PROVIDER---")
          console.log(account)
          const dbUser = await verifyUser(profile!)
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token: dbUser.token,
            image: profile?.picture as string || ""
          }
        } else {
          return {
            ...token,
            ...user
          }
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ token, session } : { token: JWT, session: any }) {
      session.user = {
        ...session.user,
        id: token.id as number,
        email: token.email,
        name: token.name,
        token: token.token as string,
        image: token.image as string || ""
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
  },
}

export async function getRandom() {
  const res = await fetch('https://randomuser.me/api/');
  if(!res.ok){
    throw new Error(`Error: ${res.statusText}`)
  }
  const data = await res.json();
  const firstRandomUser = data.results[0];
  const user = {
    username: firstRandomUser.login.username,
    password: firstRandomUser.login.password
  }
  return user;
}

export const loginFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters'
  }).max(50),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters and less than 16.'
  }).max(16),
})

export const registerFormSchema = z.object({
  firstname: z.string().min(2, {
    message: 'Firstname is required'
  }).max(50),
  lastname: z.string().min(2, {
    message: 'Lastname is required'
  }).max(50),
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters'
  }).max(50),
  email: z.string().email("Por favor, ingrese un correo electrónico válido."),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters and less than 16.'
  }).max(16),
})

export async function loginSubmit(values: z.infer<typeof loginFormSchema>) {
  try {
    const response = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false
    });
    return response;
  } catch (error) {
    console.error("Error en el proceso de login:", error);
  }
}

export async function registerSubmit(values: z.infer<typeof registerFormSchema>) {

  const user = {
    name: values.firstname,
    lastName: values.lastname,
    username: values.username,
    email: values.email,
    password: values.password
  };

  await createUser(user);

  const response = await signIn("credentials", {
    username: values.username,
    password: values.password,
    redirect: false,
    callbackUrl: "/dashboard",
  })
  return response;
}

export async function verifyUser(profile : Profile) {

  console.log("---VERIFICANDO USER---")
  const randomData = await getRandom();
  const user = {
    name: profile.name?.split(" ")[0] as string,
    lastName: profile.name?.split(" ")[1] as string,
    username: profile.email as string,
    email: profile.email as string,
    password: randomData.password,
    image: profile.image,
    idProvider: profile.sub as string
  }
  // VERIFICA QUE NO EXISTA OTRO USUARIO CON ESTOS DATOS
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/username/${user.username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if(res.status === 404){ // SI NO EXISTE EL USUARIO CREALO
    console.log("---NO EXISTE EL USUARIO---")
    const createResult = await createUser(user)
    return createResult;
  } else {
    const user = await res.json();
    const loginResult = await loginUser(user.username, user.password)
    console.log("---SI EXISTE EL USUARIO---")
    return loginResult;
  }
}

  