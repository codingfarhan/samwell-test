This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install all dependencies:

```bash
npm install
```

First, add a .env file to the project with the following content:

```bash
UNSPLASH_ACCESS_KEY=n73GTYuqwgV3mTVDtgMFr7o9UsIvpuhN_jjI2nHh4aY
```

This will allow us to access the Unsplash API for fetching images from the Backend.

Then, run the backend server:

```bash
node server.js
```

Next, run the frontend server:

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
