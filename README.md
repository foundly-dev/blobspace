# blobspace.fun

View the official site at: [blobspace.fun](https://www.blobspace.fun)

This is a visualization tool for exploring blob data on Ethereum.
Explore historical blob data since the Dencun upgrade using the
historical timeline. Switch between the interactive blob and treemap
views. Data is automatically updated once per day from the
<a
              href="https://dune.com/hildobby/blobs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
hildobby Ethereum Blobs Dune dashboard.
</a>

## Running Data Scripts

Get yourself a [Dune API](https://dune.com/settings/api) key and create a `.env` file

```env
DUNE_API_KEY="your-api-key"
```

Get the latest data by running the following scripts. These scripts are run automatically once per day to fetch the latest data via the `update-blobs` action

```bash
pnpm scripts:index-all
pnpm script:write-dates
```

## Running the frontend

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

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
