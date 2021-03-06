var MarkdownIt = require('markdown-it')
var hljs = require('highlight.js')

var md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const Post = require('../lib/mongo').Post

// 将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = md.render(post.content)
      return post
    })
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = md.render(post.content)
    }
    return post
  }
})

module.exports = {
  // 创建一篇文章
  create: function create(post) {
    return Post.create(post).exec()
  },

  // 通过文章 id 获取一篇文章
  getPostById: function getPostById(postId) {
    return Post
      .findOne({
        _id: postId
      })
      .populate({
        path: 'author',
        model: 'User'
      })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  getPosts: function getPosts(page) {
    // const query = {}
    // if (author) {
    //   query.author = author
    // }
    if (page) {
      var cursor = (page - 1) * 20
    }
    return Post
      // .find(query)
      .find()
      .skip(cursor)
      .limit(20)
      .populate({
        path: 'author',
        model: 'User'
      })
      .sort({
        _id: -1
      })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 通过文章 id 给 pv 加 1
  incPv: function incPv(postId) {
    return Post
      .update({
        _id: postId
      }, {
        $inc: {
          pv: 1
        }
      })
      .exec()
  },

  // 通过文章 id 获取一篇原生文章（编辑文章）
  getRawPostById: function getRawPostById(postId) {
    return Post
      .findOne({
        _id: postId
      })
      .populate({
        path: 'author',
        model: 'User'
      })
      .exec()
  },

  // 通过文章 id 更新一篇文章
  updatePostById: function updatePostById(postId, data) {
    return Post.update({
      _id: postId
    }, {
      $set: data
    }).exec()
  },

  // 通过文章 id 删除一篇文章
  delPostById: function delPostById(postId) {
    return Post.deleteOne({
      _id: postId
    }).exec()
  }
}
