# social-network-MERN
A social media app built using the MERN stack

### Built With
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
*	![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
* ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
* ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
## Try it out
[https://social-network-mern.vercel.app/](https://social-network-mern.vercel.app/)
- Login using your username and password or create a new account
- <strong>If you don't want to register</strong>, login using the <strong>demo</strong> account:
  - <strong>username</strong>: demo
  - <strong>password</strong>: 123456

## Features
- User authentication with JWT
- Persistent user login
- Create, edit, or delete your own posts
- Follow other users
- Like posts
- Create, edit, or delete your own comments on posts
- Like comments
- Bookmark posts
- Dark mode toggle

## Getting Started
### Prerequisites
* npm

Go to https://nodejs.org and install node.js
```
npm install npm@latest -g
```
* Install mongodb

### Installation
1. Clone the repo
```
git clone https://github.com/drew18moore/social-network-MERN.git
```
2. Install npm packages
```
cd server
npm install

cd ../client
npm install
```

3. Inside of the root of the server directory, create a .env file, and write the following:
```
DATABASE_URL = "mongodb://localhost/social"
ACCESS_TOKEN_SECRET = "<randomstring>"
REFRESH_TOKEN_SECRET = "<randomstring>"
```
## Usage
* To run the application, open two terminal instances and run:

Instance #1
```
cd server
npm run dev
```
Instance #2
```
cd client
npm run start
```
