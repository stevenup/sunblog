module.exports = {
  port: 3000,
  session: {
    secret: 'sunblog',
    key: 'sunblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/sunblog'
}
