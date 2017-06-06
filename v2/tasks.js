module.exports.tasks = () => {
  return [
    {
      regs: [/https:\/\/www\.amazon\.c(n|om)\/?$/],
      handler: async function() {
        if (!current) {
          toast('当前所有用户均已执行, 即将关闭任务按钮.');
          await localSet('enabled', false);
          clearCookies();
          return;
        }
        await toast('跳转至登录页面');
        $('#nav-signin-tooltip a') && $('#nav-signin-tooltip a').click();
        $('#nav-flyout-ya-signin a') && $('#nav-flyout-ya-signin a').click();
      }
    },
    {
      regs: [/https:\/\/www\.amazon\.cn\/ap\/signin/],
      // reg: 'https://www.amazon.com/ap/signin',
      handler: async function () {
        let error = $('#auth-error-message-box');
        let warn = $('#auth-warning-message-box');
        if (error || warn) {
          const user = getCurrentUser();
          let message = (error || warn).querySelector('.a-alert-content').textContent;
          message = message.trim();
          message = message.replace(/\s/g, ' ');

          user['状态'] = '执行出错';
          user['备注'] = message;

          await toast('执行错误，' + message);
          await saveExcelFile();
          await finish();

          return;
        }
        await toast('输入邮箱');
        await typing('input#ap_email', current['邮箱']);
        await toast('输入密码');
        await typing('input#ap_password', current['密码']);
        await toast('点击登录');
        $('input#signInSubmit').click();
      }
    },
    {
      regs: [/https:\/\/www\.amazon\.cn\/gp\/yourstore\/home/, /https:\/\/www\.amazon\.cn\/\?ref_=nav_signin&/],
      // reg: 'https://www.amazon.com/?ref_=nav_custrec_signin&',
      handler: async function () {
        await toast('输入关键字');
        await typing('input#twotabsearchtextbox', current['关键词']);
        $('span#nav-search-submit-text + input').click()
      }
    },
    {
      regs: [/https:\/\/www\.amazon\.cn\/s\/ref=nb_sb_noss/],
      handler: async function () {
        const asin = current['ASIN'];
        const target = Array.from(document.querySelectorAll('#s-results-list-atf li')).find(g => g.dataset.asin == asin);

        if (target) {
          await toast('找到商品 ' + target.querySelector('h2').innerHTML);
          location.href = target.querySelector('img').parentNode.href;
        } else {
          await toast('未找到')
        }
      }
    },
    {
      regs: [new RegExp(`https://www\\.amazon\\.cn\\/[^\\/]*\\/dp\\/${current && current['ASIN'] || ""}\\/`)],
      handler: async function () {
        await toast('添加至wishlist');
        $('input#add-to-wishlist-button-submit').click();

        await sleep(4000)
        // Create a new wishlist
        $('span#WLNEW_submit') && $('span#WLNEW_submit').click();

        await sleep(4000)
        // See wishlist
        $('span.w-button-text') && $('span.w-button-text').click();

        await sleep(4000)
        // See wishlist @ second time.
        $('a#WLHUC_viewlist') && $('a#WLHUC_viewlist').click();
      }
    },
    {
      regs: [/https:\/\/www\.amazon\.cn\/gp\/registry\/wishlist/],
      handler: async function () {
        const user = getCurrentUser();
        user['状态'] = '已执行';
        user['备注'] = '无';
        await saveExcelFile();
        await finish();
      }
    }
  ]
}
