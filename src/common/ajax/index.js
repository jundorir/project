import axios from "axios";
// axios.defaults.baseURL = "/history";
// axios.defaults.baseURL = "http://dev-mmr.mmr.finance:81/index.php/api"; //测试环境
axios.defaults.baseURL = 'https://api2.mmr.finance/index.php/api' //正式环境
//添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    if (config.method === "post") {
      // post请求时，处理数据
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      //config.data = qs.stringify( {
      //   ...config.data //后台数据接收这块需要以表单形式提交数据，而axios中post默认的提交是json数据,所以这里选用qs模块来处理数据，也有其他处理方式，但个人觉得这个方式最简单好用
      //})
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      // 请求发送成功
      return response.data;
    }
  },
  function (error) {
    // Toast.fail("network error");
    return Promise.reject(error);
  }
);

export default axios;
