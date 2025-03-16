# Auth Login System - Gino Carabelli

Welcome to my personal project, here you'll see all the required tools for run the project successfully, like backend and frontend
I'm so excited to share this project with you because it's one of my first projects, so i hope you like it.

## Introduction
Auth Login System is a project that you can login with completely security, because it use <strong>Next Auth</strong> library.
Remember that it is a personal and junior project so there is many things that i can upgrade, like a clean code, good practices, etc.
But i think that is not bad for be one of my first projects.

## Run the project
The project is simple.
* Go to Backend/Login and run the C# solution API in the localhost or another site
* Run the frontend.

Once everything is ready, you can test the app.

## Usage
In the home page you'll see a button that indicates if you are or not logged, so if you are logged the button will sign out the session,
else you'll be redirected to the login/register page.
  In the login page you can log in with your credentials (username, password) or with your google account. If you don't have an account
registered you can use this test account:
* <strong>username</strong>: testuser
* <strong>password</strong>: password123

But if you want to log in with your Google Account, you'll have to click on "Log in with google" button. This button is configured to verify
that there is no account registered with your Google Account. If it does not exist, it creates an account in the database and returns the new session automatically.
This is why it may take a little longer to log in.

>[!NOTE]
> In the server console you can see in real time the results of the Google login methods.

Once your session was verificated and created, you'll see in the server console your session data, that is configurated for return especified data, like this:
* Account Id (in the database) - This is for be reused in other http methods.
* Name & Email - This is only for basic information
* JWT - The most important session data, with this JWT you can make every http request on your app
* Session Expires - This is only for basic information

## Final
This project is so easy to use. I hope it's been useful and you can reuse it in your projects. Contribution and credit for the use of the project are not mandatory. Thank you very much for take your time reading this doc.
