const gql = require('graphql-tag')
const passport = require('passport')
const TwitchStrategy = require('@d-fischer/passport-twitch').Strategy
const fetchFromGraphQL = require('../utils/fetchFromGraphQL')

module.exports = function (app) {
  app.use(require('cookie-parser')())
  app.use(
    require('express-session')({
      secret: 'io samuel',
      resave: false,
      saveUninitialized: true,
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  // twitch
  passport.use(
    new TwitchStrategy(
      {
        clientID: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}${process.env.TWITCH_CALLBACK_URL}`,
        scope:
          'channel_check_subscription channel_commercial channel_editor channel_feed_edit channel_feed_read channel_read channel_stream channel_subscriptions collections_edit communities_edit communities_moderate openid user_blocks_edit user_blocks_read user_follows_edit user_read user_subscriptions viewing_activity_read channel:moderate chat:edit chat:read',
      },
      function (token, refreshToken, profile, done) {
        profile.access_token = token
        profile.refresh_token = refreshToken

        delete profile.provider
        delete profile.view_count

        fetchFromGraphQL(
          `
            query getUser($userID: String!, $userLogin: String!) {
              user_by_pk(id: $userID, login: $userLogin) {
                id
              }
            }
          `,
          {
            userID: profile.id,
            userLogin: profile.login,
          }
        ).then(({ data }) => {
          if (!data.user_by_pk) {
            fetchFromGraphQL(
              `
                mutation insertSingleUser($user: user_insert_input!) {
                  insert_user_one(object: $user) {
                    id
                  }
                }
              `,
              {
                user: {
                  ...profile,
                },
              }
            ).then(() => {
              done(null, profile)
            })
          } else {
            done(null, profile)
          }
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((obj, done) => {
    done(null, obj)
  })

  app.get(
    '/twitch/auth',
    passport.authenticate('twitch', { forceVerify: true })
  )
  app.get(
    '/twitch/callback',
    passport.authenticate('twitch', {
      failureRedirect: '/',
    }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/')
    }
  )

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
}
