import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { Octokit } from 'octokit';
import { OCTO_KEY } from '$env/static/private';

export const load = (async () => {
	const start = Date.now();

	const octokit = new Octokit({
		auth: OCTO_KEY
	});

	let res = await octokit.request('GET /repos/{owner}/{repo}/tags', {
		owner: 'BetterLectio',
		repo: 'BetterLectio-next',
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	if (res.status !== 200) {
		return error(res.status);
	}

	let tagsArray: string[] = res.data.map((tag) => {
		return tag.name;
	});

	//filter out the tags that have app in them
	let appTags = tagsArray.filter((tag: string) => !tag.includes('app'));
	console.log(appTags);

	// get the release notes for all the tags in parallel
	let published_at: string[] = [];
	let releaseNotes = await Promise.all(
		appTags.map(async (tag: string) => {
			try {
				let res = await octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
					owner: 'BetterLectio',
					repo: 'BetterLectio-next',
					tag: tag,
					headers: {
						'X-GitHub-Api-Version': '2022-11-28'
					}
				});

				if (res.status !== 200) {
					return 'No release notes found';
				}

				published_at.push(res.data.published_at || 'unknown');
				return res.data.body;
			} catch (error) {
				published_at.push('unknown');
				return 'No release notes found';
			}
		})
	);

	console.log(releaseNotes);

	const releases = appTags.map((tag, index) => {
		return {
			tag: tag,
			releaseNotes: releaseNotes[index],
			publishedAt: published_at[index]
		};
	});

	const end = Date.now();
	return {
		time: end - start,
		releases: releases
	};
}) satisfies PageServerLoad;
