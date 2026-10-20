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

The frontend uses same-origin Next.js route handlers for authentication and authenticated REST calls. Access tokens are stored in an HttpOnly cookie and are forwarded to the NestJS API as Bearer tokens by the server-side API route.

Configure the backend URL in the frontend runtime environment:

```env
BACKEND_API_URL=http://localhost:5000
JWT_EXPIRES_IN_SECONDS=3600
```

- `BACKEND_API_URL` should point to the NestJS server root URL, without an `/api` suffix.
- `JWT_EXPIRES_IN_SECONDS` should match the backend `JWT_EXPIRES_IN_SECONDS` setting so the session cookie and JWT expire together.
- For local development, run the NestJS server on port `5000` and the Next.js app on port `3000`.
- Guardian sign-in requires the backend database and WhatsApp OTP delivery to be configured.
- The guardian portal reads linked students, submitted attendance, behavior records, and class homework from the backend. Teacher attendance, behavior, homework, and communication-log actions persist through the existing REST endpoints.
