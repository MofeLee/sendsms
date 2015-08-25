var csv = require('csv');
var fs = require('fs');
var _ = require('lodash');
var request = require('request');

var password = process.env.password;

fs.readFile('./1.csv', 'utf8', function(err, output) {
  if (err) throw err;
  // console.log(data);
  var options = {
    columns: true
  };
  csv.parse(output, options, function(err, data) {
    // console.log(data[0]);
    // 移除空电话
    var olddata = data;
    var newdata = _.remove(olddata, function(n) {
      return n.tel.trim().length == 11;
    });
    // console.log(newdata);
    // 移除非手机
    var newdata2 = _.remove(newdata, function(n) {
      return n.tel.trim()[0] == 1;
    });
    // console.log(newdata2);
    // 移除非近视
    var newdata3 = _.remove(newdata2, function(n) {
      return Number.parseInt(n.r.trim()) < 0;
    });
    // console.log(newdata3);
    sendSms(newdata3);
  });
});
// var x = 'http://www.smswst.com/api/httpapi.aspx?action=send&account=mofe&password='+ process.env.password +'&mobile=<%= tel %>&content=<%= content %>&sendTime=2015-08-26 09:08:10&AddSign=N';

var smsCompiled = _.template('尊敬的<%= name %>，您好。系统检测到您已配镜三月有余，您可以在方便的时候过来免费复测视力，复测时请务必带上您的眼镜。【宝岛眼镜】');
// console.log(smsCompiled({
//   name: 'liyong'
// }));

// 传入数据库对象， 构建发送对象

function compileFormObj(obj) {
  obj.name = obj.name.trim();
  obj.name = obj.name.replace(/(\?|？)/g, '');
  var result = {
    action: 'send',
    account: 'mofe',
    password: password,
    mobile: obj.tel.trim(), //////////替换这里
    content: smsCompiled(obj), ///////替换
    sendTime: '2015-08-26 09:00:00',
    AddSign: 'N'
  };
  return result;
}

function sendSms(data) {
  var count = 0;
  _.forEach(data, function(n) {
    request.post({
      url: 'http://www.smswst.com/api/httpapi.aspx',
      form: compileFormObj(n)
    }, function(err, httpResponse, body) {
      if (err) throw err;
      console.log(body);
    });
    count++;
  });
  console.log(count);
}


// var testObj = {
//   action: 'send',
//   account: 'mofe',
//   password: process.env.password,
//   mobile: '18079309053', //////////替换这里
//   content: smsCompiled({
//     name: '李勇'
//   }), ///////替换
//   sendTime: '2015-08-25 11:00:00',
//   AddSign: 'N'
// };
// request.post({
//   url: 'http://www.smswst.com/api/httpapi.aspx',
//   form: testObj
// }, function(err, httpResponse, body) {
//   if (err) throw err;
//   console.log(httpResponse);
//   console.log(body);
// });
