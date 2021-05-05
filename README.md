## Quanta Code Assessment

This is a small Next.js app. Some data has been generated for fake loans. Each row should contain a company name, email, and then an address and amount.

To view, run `yarn dev` and go to localhost:3000. You should see a JSON data dump.

To see where the data is being served from, view the file pages/api/data.js. You will want to edit this for things like filtering based on incoming requests.

As far as the client, see index.js. That's really it.

Feel free to modify structure, adding new pages or a folder for components.

What I would like to see:

Add a filter to search by address. All filtering and such should be done server-side. Somethings to consider: how do you handle a fast typer and limit requests? Use a custom hook for this if you can. How do you handle pagination? What approach do you take to styling?

Feel free to add external libraries. Use any approach to styling you wish...be it styled-components, tailwind, material-ui etc.

Zip the final code (exluding node_modules please) and email to abrown@quantafinance.com.

If you are unfamiliar with Next.js, you can read about it here: https://nextjs.org/learn/basics/create-nextjs-app