## Agora Space

Agora Space is an online platform for users to connect to people worldwide and share thoughts and ideas.  

## Project Overview

In the forum app, we will have signed-up users. And users can create spaces(groups) among themselves. In spaces, users can creat posts and comment on posts. Users can upvote and downvote posts. There will be a home page, where users will be redirected after signing in or signup. On the dashboard, there will be recent posts of the current user’s spaces that he/she has joined. There will be a notifications panel that shows notifications of all sorts.


## Project Features

All associated entities and features will be:

- User:
    - User login/signup
    - User Profile page.

- Posts:
    - Users can create, and update posts.
    - Comment on Posts 
    - Comment on Comments
    - Posts can have multimedia as well 
    - Users can upvote and Downvote posts.
    
- Spaces (groups):
    - Users can create spaces (groups)
    - Users can join/be added to spaces.
    - Posts will be created inside the spaces.
    - Users can join and leave a space.

## Project Architecture:
The website is being developed using **MERN** (MongoDB, Express.js, React.js, Node.js) stack. For state management, Redux is used. For Notifications and other updates Socket.io is used and for UI styling, TailWindCSS is used.

## Installation

1. Clone the repo 
```bash
  git clone https://github.com:Sauvikn98/Agora-Space.git
```
2. Create a `.env` file and put the following
```bash
MONGODB_ATLAS_URI="<your_mongoDB_uri>"
JWT_TOKEN="<your_jwt_token>"
```
3. install dependencies for server and client
```bash 
    npm install
    cd client && npm install
```
4. start the server 
```bash
    nodemon server
```
5. start the client app
```bash
    npm run dev
```


##  Author

- [Sauvik Nath](https://github.com/Sauvikn98)

##  Mentor

- [Mintu Moni Kurmi](https://github.com/mintukurmiTV)

##  Supervisors

- [Nimish Bhardwaj]()
- [Neelam Das]()
