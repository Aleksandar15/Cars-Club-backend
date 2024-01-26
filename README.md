# CARS CLUB

##### ~> My <a href="https://github.com/Aleksandar15/Cars-Club-frontend">frontend code</a>.

#### Visit my live website here: https://cars-club.netlify.app

##### Test login user:

1. Click the `Login as a test user` button
2. - E-mail: test@test.com
   - Password: test

#### About my Full-Stack Cars Club APP:

Combining my passion for cars I created this fullstack project with one of the main goal being that to improve my TypeScript skills. I had focused on setting up a reusable and scalable code that can be used for implementing more features. Now that it's all looking & working smoothly, my app is at a state where I can continue implementing my new ideas in the future updates seamlessly.

#### On the frontend

- Users can create a Post with an image, then submit this `multipart/form-data` request with all the input values appended to a `FormData`.
- I'm converting the backend's image value - a _binary data_ - into a `src` value using a function that first converts it to `Uint8Array` instance, then I'm grabbing the `buffer` property value & passing it as an argument to the `Blob`'s constructor (but passing the whole instance works as well). Finally with `URL.createObjectURL` I'm creating a URL from this Blob that is used as the `src` value.

#### On the backend

- I'm using Multer middleware to process the `FormData` received from a `multipart/form-data` request with the storage option `memoryStorage()`, then using `upload.single` instance middleware to populate `req.file` with metadata about the image. My controller _only_ stores the _binary data_ from the `buffer` property into my PostgreSQL as a `BYTEA` column type.
- My `refresh_tokens` and `posts` tables both have a MANY-TO-ONE relationship with my `users` table.

#### Technologies used:

###### TypeScript + ReactJS with Redux Toolkit + NodeJS with ExpressJS and MulterJS + PostgreSQL Database

<h4 style="text-align: center;">^ UPDATE ^</h4>

---

##### Note: I'm still working on this fullstack project - <del>it's not yet</del> finished & my main goal is to improve my TypeScript skills. **UPDATE**: ✔ **DONE**

#### Plans & Features (in non-technical way):

- Login & Register sections. ✔
- Section for cars info & specifications: Catalog. ✔
- Section for posting cars for sales (allowed by all users): Marketplace. ✔
- Posts will be connected to the OP user (original poster) & they can update or delete their post. ✔
- Users not related to a particular post will be able to comment; they will be related to their own comment & be able to update and delete their own comment. 🔃

### Run my backend project

- Clone this project.
- Navigate (`cd`) into your project directory.
- Run `npm install` in your command line.
- Run `npm run dev` in your command line (_or modify your own scripts inside `package.json`_).
  - The concurrently package is used to automatically "_watch_" for `.ts` file changes (_inside `src` as specified in `tsconfig.json`_) and compile on save.
    - I have also added `npm run devNoOnSaveCompile` command for `ts-node` which _runs `.ts` file without compiling it to `.js` first_, but it is so much slower than the `concurrently` command, so I don't recommend 'ts-node'.
- Visit http://localhost:3000 in your browser.
  - That's if you use Vite (_V4 specifically_) on the frontend, like I do on my <a href="https://github.com/Aleksandar15/Cars-Club-frontend">frontend</a> which runs on PORT 5173 by default.
- For the full functionality connect it with my <a href="https://github.com/Aleksandar15/Cars-Club-frontend">frontend</a> project.

#### How to's

- If you want to deploy the frontend part on Netlify you should copy the code included in my Frontend's <a href="https://github.com/Aleksandar15/Cars-Club-frontend/blob/main/netlify.toml">netlify.toml</a> file.
- To deploy the backend you can use alternatives to Heroku: <a href="https://render.com">https://render.com</a> or <a href="https://fly.io/docs/apps/deploy">https://fly.io/docs/apps/deploy</a> (_but fly.io limits to 1 free app per credit card_).

##### More informations

1. I have this `getCookieOptions` function you can use for most default "_cookieOptions_" properties or otherwise set up your own as these are not limitations.
   - Warning is if you deploy your app, there it might not have a `NODE_ENV` environment variable so you must specify it to `'production'` (if it's not already by default; otherwise it'd use the `'development'` options) and also you'd need to modify that function to include a `domain` property (which is currently commented out) value of URL.

##### Sources

- For most of my SVG icons I've used a PNG version of icons8 and then converted that PNG into SVG using sites like https://www.pngtosvg.com.

<h4 style="text-align: center;">NO NEED TO READ BELOW ARE MY REMINDERS 😊</h4>

---

##### Extras & Journals & Plans <a href="https://github.com/Aleksandar15/Cars-Club-backend-reminders">here</a> (_backend reminders for me_; no need to go in there - it's the size of a book 😊.)
