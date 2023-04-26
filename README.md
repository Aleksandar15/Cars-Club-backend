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
- Visit http://localhost:3000 in your browser.
  - That's if you use Vite (_V4 specifically_) like I do on my <a href="https://github.com/Aleksandar15/Cars-Club-frontend">frontend</a> which runs on PORT 5173 by default.
- For the full functionality connect it with my <a href="https://github.com/Aleksandar15/Cars-Club-frontend">frontend</a> project.

#### How to's

- If you want to deploy the frontend part on Netlify you should copy the code included in my Frontend's <a href="https://github.com/Aleksandar15/Cars-Club-frontend/blob/main/netlify.toml">netlify.toml</a> file.
- To deploy the backend you can use alternatives to Heroku: <a href="https://render.com">https://render.com</a> or <a href="https://fly.io/docs/apps/deploy">https://fly.io/docs/apps/deploy</a> (_but fly.io limits to 1 free app per credit card_).

##### Sources

- For most of my SVG icons I've used a PNG version of icons8 and then converted that PNG into SVG using sites like https://www.pngtosvg.com.
