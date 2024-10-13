import Elysia from "elysia";

export const events = new Elysia({ prefix: '/events' })
    .post('/sign-in', 'Sign in')
    .post('/sign-up', 'Sign up')
    .post('/profile', 'Profile')