
module.exports = {

  db: process.env.MONGODB || 'mongodb://localhost:27017/mblog-test',

  sessionSecret: process.env.SESSION_SECRET || 'sandbox697fcddc09814c6b83718b9fd5d4e5dc',

  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox697fcddc09814c6b83718b9fd5d4e5dc.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '29eldds1uri6'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '1595350474085535',
    clientSecret: process.env.FACEBOOK_SECRET || '1a21d15753eb3e68e2b49995ac803cb5',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  }

}