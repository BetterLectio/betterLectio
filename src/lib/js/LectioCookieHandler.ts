export function cookieInfo() {
	return new Promise((resolve) => {
		if (
			!localStorage.getItem('lectio-cookie') &&
			window.location.href.split('?')[0].split('/').at(-1) !== 'auth' &&
			window.location.href.split('?')[0].split('/').at(-1) !== ''
		) {
			// error handling based on page
		} else {
			try {
				const cookie = localStorage.getItem('lectio-cookie');
				if (cookie === null) return resolve(false);

				const parsedCookie = JSON.parse(window.atob(cookie));
				const userDict = {
					user: '',
					schoolId: '',
					userId: ''
				};
				parsedCookie.forEach((_cookie: any) => {
					if (_cookie.name === 'LastLoginUserName') userDict.user = _cookie.value;
					else if (_cookie.name === 'LastLoginExamno') userDict.schoolId = _cookie.value;
					else if (_cookie.name === 'LastLoginElevId') userDict.userId = _cookie.value;
				});
				return resolve(userDict);
			} catch (error) {
				console.error(error);
				return resolve(false);
			}
		}

		return resolve(false);
	});
}
