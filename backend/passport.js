// backend/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');  // Import User model

passport.use(
  new GoogleStrategy(
    {
      clientID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google client ID
      clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET', // Replace with your Google client secret
      callbackURL: 'http://localhost:5000/api/auth/google/callback', // Change to your backend's URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, name } = profile;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, existingUser); // User exists, proceed to login
        }

        // Create a new user if they don't exist
        const newUser = new User({
          email,
          firstname: name.givenName,
          lastname: name.familyName,
          userType: 'student', // Default userType
        });

        await newUser.save();
        return done(null, newUser); // Proceed with the new user
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user from session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
