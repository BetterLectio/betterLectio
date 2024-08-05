import { Octokit } from 'octokit';
import axios from 'axios';
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		console.log('GET /updateserver/+server.js');

		// from this github "https://github.com/BetterLectio/BetterLectio-next/releases"
		// get the latest release
		// down load the latest.json file from the release
		// return the json file


		const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

		const { data: latestRelease } = await octokit.request('GET /repos/BetterLectio/BetterLectio-next/releases/latest', { headers: { 'X-GitHub-Api-Version': '2022-11-28' } });

		let index = 0;
		let downloadUrl = '';
		latestRelease.assets.forEach(async asset => {
			if (asset.name === 'latest.json') {
				console.log('latest.json found');
				index = 1;
				downloadUrl = asset.browser_download_url;
			}
		});

		// download the latest.json file
		const response = await axios.get(downloadUrl);
		const latestJson = response.data;
		console.log(latestJson);
		return json(latestJson);
	} catch (error) {
		console.log(error);
		return json({ error });
	}
}
