import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import User from '../models/User.js'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value
    if (!email) return done(new Error('No email returned from Google'), null)

    let user = await User.findOne({ email })
    if (user) {
      if (!user.providerId) {
        user.provider = 'google'
        user.providerId = profile.id
        if (!user.avatar && profile.photos?.[0]?.value) {
          user.avatar = profile.photos[0].value
        }
        await user.save()
      }
      return done(null, user)
    }

    user = await User.create({
      name: profile.displayName,
      email,
      password: undefined,
      provider: 'google',
      providerId: profile.id,
      avatar: profile.photos?.[0]?.value || '',
      isVerified: true
    })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
}))

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/api/auth/github/callback',
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || profile.username
    if (!email) return done(new Error('No email returned from GitHub'), null)

    let user = await User.findOne({ email: email.toLowerCase() })
    if (user) {
      if (!user.providerId) {
        user.provider = 'github'
        user.providerId = profile.id
        if (!user.avatar && profile.photos?.[0]?.value) {
          user.avatar = profile.photos[0].value
        }
        await user.save()
      }
      return done(null, user)
    }

    const displayName = profile.displayName || profile.username
    user = await User.create({
      name: displayName,
      email: email.toLowerCase(),
      password: undefined,
      provider: 'github',
      providerId: profile.id,
      avatar: profile.photos?.[0]?.value || '',
      isVerified: true
    })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

export default passport
