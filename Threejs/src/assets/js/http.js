import axios from 'axios';
import qs form 'qs';
import Cookies from 'js-cookie';

window.axios = axios;

const apiConfig = {
	localhost: {
		url: ''
	},
	'test环境url': {
		url: ''
	},
	'demo环境url': {
		url: ''
	},
	'生产环境url': {
		url: ''
	}
};

const ENV = apiConfig[window.location.host];

export default {
	install(Vue) {
		const baseUrl = `${ENV.url}`;

		const fetch = axios.create({
			transformRequest: [data => qs.stringify(data)],
		});

		fetch.interceptors.request.use((config) => {
			if (!Cookies.get('_TOKEN')) {
				//未登陆时的操作
			}
			return config;
		}, error => Promise.reject(error));

		fetch.interceptors.response.use((response) => {
			if (response.data.code !== 0) {
				//提示接口业务错误
				return Promise.reject(new Error(response.data.msg));
			}
			return response.data.data;
		}, (error) => {
			let message = error.message;

			// 统一提示接口错误
			return Promise.reject(error);
		});

		window.$http = {
			get(path, params = {}) {
				const url = baseUrl + path;
				return fetch({
					method: 'get',
					url,
					params,
				});
			},
			post(path, data = {}) {
				const url = baseUrl + path;
				return fetch({
					method: 'post',
					url,
					data,
				});
			}
		};
	},
};
