// config/passport.js
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import User from "../models/user";
// import dotenv from "dotenv";
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/user"); // make sure file name matches exactly (User.js)
const dotenv = require("dotenv");

dotenv.config();

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3333/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Google profile:', profile);
        // Extract email safely
            const email = profile.emails && profile.emails[0]?.value;
            console.log(email)
        // Try finding an existing user
            let user = await User.findOne({ emailId: email });
            console.log(user)
            if (!user) {
            user = await User.create({
                googleId: profile.id,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                emailId: email, // ✅ fix: include this
                photoURl: profile.photos?.[0]?.value,
            });
            console.log('data saved successfully')
            } done(null, user); } catch (err) {
                console.log(err)
            done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
}
