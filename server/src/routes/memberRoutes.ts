import Elysia from "elysia";

export const members = new Elysia({ prefix: '/members' })
    .post('/sign-in', 'Sign in')
    .post('/sign-up', 'Sign up')
    .post('/profile', 'Profile')