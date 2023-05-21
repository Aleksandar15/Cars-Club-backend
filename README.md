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
   - On the frontend, in my React app, I **_must_** use a state of `flag` (_update_: or rather the `'loading'`Redux Toolkit state)
     in-between the `/refreshtoken` endpoint HTTP (Axios interceptors) requests, because
     it serves a purpose for the slow-internet users, whereas: without it
     if they made a rapid fast requests before response is received
     they'll have a failed response on the 2nd (or 3rd, etc.) request
     because this `refreshTokenController` will read the same `refreshToken`
     cookie twice -> and will 'think' the 2nd request was an attempt
     to re-use token, since I don't like the #1st Fix: a queue and
     flag on the backend (or use a caching library like `node-cache`): which would mean I keep the `refreshToken` in a
     cache for a little while & allow re-use for a brief period of time
     for the sake of slow-internet users & thus breaking my rules of
     1 refreshToken = 1 request; and further making my server a little bit less
     secure: by openning a window for a fast enough hacker to re-use
     the token on behalf of the victimized user without getting caught in my "detect refreshToken reuse" logic. I don't wanted to
     make such a sacrifice so instead leave the backend's `refreshTokenController` logic as-is: if
     slow-internet conneciton user rapidly fires 2 requests very fast
     the 2nd would fail -> HOWEVER that's where the fix #2 comes with the
     `flag` state on the frontend side in React: which would be set to `true` (boolean) initially & just before the request is made then the `setFlag(false)` would be called & once
     response has arrived ONLY then I'll `setFlag(true)` again & thus
     allowing for further request ONLY AFTER the previous response has
     arrived, in similar fashion to what `useEffect` does with its cleanup function when making GET HTTP requests.
3. Server URL updated: from `https://cars-clubs-backend.onrender.com` to `https://cars-clubs-server.onrender.com`-> BUT I must **manual deploy** it from my second account (where my Cars Club Database is deployed at!). _EXPLANATIONS_: that `-server` subdomain is deployed on my second Render account which is where my Database Cars Club is deployed as well, I had to do it because on the first Render account (with `-backend` subdomain deployed) there's multiple servers and by using Cron Jobs (to keep my Cars Club server running 24/7) I'd run out of free instances on the 31th day (well Render.com offers 750 free hours and Cars Club backend taking up 744, **_BUT_** I have 5 more servers running on my first Render account: ~1.5 hours each (imagine if they run even longer per month/gets more visits -> they'll go down at like 25th day each month)). That's why I instead re-deployed Cars-Clubs-server (named it `server` on the 2nd acc. instead of `backend` as was on my 1st acc.) on my second Render account **_BUT_**: I must click "manual deploy" button whenever I update my MAIN branch because I can't connect multiple Render's account to a single GitHub account (altough I do have an option to log it out and re-connect on the 2nd Render account however I'll lost the deploy for the rest of my 5 instances on the 1st Render account & any updates would require 5x manual deploys clicks) which would have allowed me auto-deploys have I had been connected to my own server. Again that's why I must do "Manual deploy from last commit" in Render.com on my server in my second account.
   - Bugs that happened is I forgot to add Environment Variables (see `.env#examples` for deployed Apps: and `ACCESS_TOKEN_SECRET` with `REFRESH_TOKEN_SECRET` and `CONNECTION_STRING_POSTGRESQL` (the **external database URL links**)) and **UPDATE**: for Render.com the server crashes if I have `NODE_ENV=production` and deployed with _cache removed_ option I found on on their forum I shouldn't be using it since they add it for me & removing it fixed the "bash tsc not found" even thought `npm i` was success on their part this error occurs when NODE_ENV is set by me.
     - Oh and talking about External Database URL Links bugs fixes with `pg` library returning "SSL/TLS required" error a fix was to add at the end of the url `?ssl=true` read more <a href="https://stackoverflow.com/questions/22301722/ssl-for-postgresql-connection-nodejs">StackOverflow comment</a> & here at Render <a href="https://community.render.com/t/ssl-tls-required/1022">forum</a> self-answered and hyperlinks source to this StackOverflow comment above -> I googled it thinking it's a Render issue but turns out it was `pg` library issue, now fixed.
4. I thought UI/UX would be much better if I had "Posted by" username in the `Marketplace` component, but my logic was not implemented in the JWT token: and instead I had modified on the backend both `loginController` and `verifyRefreshTokenController` to incldue `user_name` in the response & for the `verifyRefreshTokenController` I must query to my Database instead of including private info like `user_email`/`user_name` in the JWT Token. Then on the Frontend also use Redux Toolkit when `useVerifyRefreshToken` is successful & has received that `user_name`, `user_role`, `user_email`, `user_id` -> For Posts UPDATE & DELETE Buttons to be rendered conditionally based on `post.user_id === user_id`.
5. IMPORTANT FACT is that the console response of 403 (Forbidden) is an "OKAY" response **if** there's updated data on the screen it means the Axios Interceptor did its job well & the 403 status means the `authorizeJWT` did a good job at protecting the Source & if the data is displayed on the Frontend then `refreshTokenController` did successfully refreshed the accessToken by using User's "session"/'refreshToken' TOKEN & delivering a fresh NEW short-lived "accessToken" (_as well as new 'refreshToken'_). :)
6. VERY IMPORTANT decision & plans I've made for NOT using Async Thunk with /editpost & /createpost ALIKE, in my setup = accessToken iS to be refreshed & used ONLY once, because it is shortly-lived so I MUST use `useAxiosInterceptor` Hook call which is IMPOSSIBLE inside Redux Files. YES I do can have "editPost" & "createPost" separate Async Thunks in a single REDUX file, but it's #1 NOT that useful
   since there's no reusability usage; and #2 the MOST important **_issue_**
   is the fact that I'll have to make sure I "just" call
   `useAxiosInterceptor`() WITHOUT using its returned Axios (_if I don't need to_) in the
   Component where I'd be calling(/dispatching) that AsyncThunk & all the while using the SAME
   intercepted Axios in the Async Thunk Redux file **BUT** imported from Axios.ts (the **EXACT** 'reference Axios instance object' that's being intercepted in my `useAxiosInterceptor` custom Hook) just to make sure
   my POST/PUT Requests won't fail by using a non-intercepted Axios instance. A lot of workaround indeed. Overall forgetting to call `useAxiosInterceptor` would lead to Async Thunk failing on me and causing bugs to my App.
   - And I also wouldn't be able to call a DISPATCH function in my Redux file to fill my `ModalPost.tsx` input fields with the VALUES matching the `post_id` that the user has clicked on, because `useDispatch` is a Hook that also **can NOT** be called inside Redux files.

##### Further plans (_reminders for me_)

1. Have an "edit username" & "edit e-mail" features, but that **will** require me to also run SQL Query against my PostgreSQL database `posts` table to run `UPDATE posts SET post_created_by_username=$1 WHERE user_id=$2` & respectively if I've choosen to show e-mail.
   - For `post_created_by_email` I might even implement a conditional checking in `ModalPost.tsx` (& "edits Posts") to make User decide whether to show "contact number" or "contact e-mail" or both. A toggler.
2. Have a comments section which `comments` table that will relate with each `post` Row of the `posts` table and `FOREIGN KEY` "user_id" column to `REFERENCE` `users` table.
3. Have a replies sections: such `replies` table will have to connect with "comment_id" from `comments` table & the "user_id" from `users` table.
4. On the Frontend part of UI/UX I may implement some alert/modal that will be shown on successful EDITs of the POST.
