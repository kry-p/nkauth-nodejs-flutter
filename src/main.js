// Firebase modules
import admin from "firebase-admin";
import serviceAccount from "../.key/serviceAccountKey.json";

// Environment variables
import "./modules/dotenv";

// import necessary modules
import express from "express";
import bodyParser from "body-parser";

// Authentication modules
import "./modules/kakao_auth";

// Initialize Firebase App Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// create an express app and use json body parser
const app = express();
app.use(bodyParser.json());

// default root url to test if the server is up
app.get("/", (req, res) =>
  res
    .status(200)
    .send("Customized login server for Firebase is up and running!")
);

// Kakao auth
// returns authentication code
app.get("/callbacks/kakao/sign_in", async (request, response) => {
  const redirect = `webauthcallback://success?${new URLSearchParams(
    request.query
  ).toString()}`;
  console.log(`Redirecting to ${redirect}`);
  response.redirect(307, redirect);
});

// API that checks user and creates custom token to Firebase
app.post("/callbacks/kakao/token", async (request, response) => {
  kakao_auth.createFirebaseToken(request.body["accessToken"], (result) => {
    response.send(result);
  });
});

// Start the server
const server = app.listen(process.env.PORT || "4000", () => {
  console.log(
    "KakaoLoginServer for Firebase listening on port %s",
    server.address().port
  );
});

export default admin;
