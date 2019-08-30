$(document).ready(function () {
  // 点击按钮弹出下拉框
  $('.ui.dropdown').dropdown();

  // 鼠标悬浮在头像上，弹出气泡提示框
  $('.post-content .avatar-link').popup({
    inline: true,
    position: 'bottom right',
    lastResort: 'bottom right'
  });

  $('#more-posts').on('click', function () {
    $.ajax({
      url: '/posts/fetch_posts',
      method: 'GET',
      data: {
        page: 1
      },
      success: function (posts) {
        console.log(posts)
      }
    })
  })
})
