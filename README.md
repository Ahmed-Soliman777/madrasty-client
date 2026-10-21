This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Backend integration

The frontend calls the NestJS REST API directly; authentication and session handling live in the backend. Web sign-in uses an HttpOnly cookie, while mobile clients can use the access token returned by the same login endpoints. No Next.js API route handlers are required for authentication or API forwarding.

Configure the frontend environment:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Configure the backend environment:

```env
FRONTEND_ORIGINS=http://localhost:3000
JWT_EXPIRES_IN_SECONDS=3600
AUTH_COOKIE_DOMAIN=
```

- `NEXT_PUBLIC_API_BASE_URL` should point to the NestJS server root URL, without an `/api` suffix.
- `FRONTEND_ORIGINS` is a comma-separated allowlist of frontend origins permitted to make credentialed browser requests.
- `AUTH_COOKIE_DOMAIN` is optional. Set it to a shared parent domain (for example, `.example.com`) when the frontend and API are on separate subdomains. Leave it unset for localhost development.
- `JWT_EXPIRES_IN_SECONDS` controls the JWT and web session-cookie lifetime.
- For local development, run the NestJS server on port `5000` and the Next.js app on port `3000`.
- Guardian sign-in requires the backend database and WhatsApp OTP delivery to be configured.
- The guardian portal reads linked students, submitted attendance, behavior records, and class homework from the backend. Teacher attendance, behavior, homework, and communication-log actions persist through the existing REST endpoints.
