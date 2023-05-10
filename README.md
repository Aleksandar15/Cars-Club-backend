# CARS CLUB

---

#### NOTE: I'm still working on this fullstack project - it's not yet finished & my main goal is to improve my TypeScript skills.

#### Plans & Features (in non-technical way):

- Login & Register sections.
- Section for cars info & specifications: Catalog.
- Section for posting cars for sales (allowed by all users): Marketplace.
- Posts will be connected to the OP user (original poster) & they can update or delete their post.
- Users not related to a particular post will be able to comment; they will be related to their own comment & be able to update and delete their own comment.

#### Technologies used:

###### Postgres DB, TypeScript, ReactJS with Redux Toolkit, NodeJS with ExpressJS

### Run my backend project

- Clone this project.
- Navigate (`cd`) into your project directory.
- Run `npm install` in your command line.
- Run `npm run dev` in your command line (_or modify your own scripts inside `package.json`_).
  - The concurrently package is used to automatically "_watch_" for `.ts` file changes (_inside `src` as specified in `tsconfig.json`_) and compile on save.
    - I have also added `npm run devNoOnSaveCompile` command for `ts-node` which _runs `.ts` file without compiling it to `.js` first_, but it is so much slower than the `concurrently` command, so I don't recommend 'ts-node'.
- Visit http://localhost:3000 in your browser.
  - That's if you use Vite (_V4 specifically_) like I do on my <a href="https://github.com/Aleksandar15/Cars-Club-frontend">frontend</a> which runs on PORT 5173 by default.
- For the full functionality connect it with my <a href="https://github.com/Aleksandar15/Cars-Club-frontend">frontend</a> project.

#### How to's

- If you want to deploy the frontend part on Netlify you should copy the code included in my Frontend's <a href="https://github.com/Aleksandar15/Cars-Club-frontend/blob/main/netlify.toml">netlify.toml</a> file.
- To deploy the backend you can use alternatives to Heroku: <a href="https://render.com">https://render.com</a> or <a href="https://fly.io/docs/apps/deploy">https://fly.io/docs/apps/deploy</a> (_but fly.io limits to 1 free app per credit card_).

##### More informations

1. I have this `getCookieOptions` function you can use for most default "_cookieOptions_" properties or otherwise set up your own as these are not limitations.
   - Warning is if you deploy your app, there it might not have a `NODE_ENV` environment variable so you must specify it to `'production'` (if it's not already by default; otherwise it'd use the `'development'` options) and also you'd need to modify that function to include a `domain` property (which is currently commented out) value of URL.

##### Sources

- For most of my SVG icons I've used a PNG version of icons8 and then converted that PNG into SVG using sites like https://www.pngtosvg.com.

##### Extras (_reminders for me_)

1. I've updated `users`' table's column `refresh_tokens` array to instead be a separate table `refresh_tokens` which has a _one to many_ relationship with `users` table (_multiple 'refresh tokens' can belong to a single user_) referencing a `FOREIGN KEY` of `user_id` with `ON DELETE CASCADE` constraint ensuring if a user deletes their account then all of their "refresh_token"'s rows would be removed with that action.

2. NOTES about `refreshTokenController.ts` (or rather a _warning_):
   - On the frontend, let's say in React, I must use a state of `flag`
     in-between the /refreshtoken ENDPOINT requests, because
     it serves a purpose for the slow-internet users, whereas: without it
     if they made a rapid fast requests before response is received
     they'll have a failed response on the 2nd (or 3rd, etc.) request
     because this `refreshTokenController` will read the same `refreshToken`
     cookie twice -> and will 'think' the 2nd request was an attempt
     to re-use token, since I don't like the #1st Fix: a queue and
     flag (or use a caching library like `node-cache`) on the backend: which would mean I keep the `refreshToken` in a
     cache for a little while & allow re-use for a brief period of time
     for the sake of slow-internet users & thus breaking my rules of
     1 refreshToken = 1 request; and further making my server a little bit less
     secure: by openning a window for a fast enough hacker to re-use
     the token on behalf of the victimized user. I don't wanted to
     make such a sacrifice so instead leave the backend's `refreshTokenController` as-is: if
     slow-internet conneciton user rapidly fires 2 requests very fast
     the 2nd would fail -> HOWEVER that's where fix #2 comes with the
     React's `flag` state: which would be set to `true` (boolean) initially &
     when request is made the `setFlag(false)` would be called & once
     response has arrived ONLY then I'll `setFlag(true)` again & thus
     allowing for further request ONLY AFTER the previous response has
     arrived, in similar fashion to what `useEffect` does with its cleanup function when making GET HTTP requests.
