export function hexToHSL(hex) {
	// Convert hex to RGB first
	let red = 0,
		green = 0,
		blue = 0;

	if (hex.length === 4) {
		red = `0x${ hex[1] }${hex[1]}`;
		green = `0x${ hex[2] }${hex[2]}`;
		blue = `0x${ hex[3] }${hex[3]}`;
	} else if (hex.length === 7) {
		red = `0x${ hex[1] }${hex[2]}`;
		green = `0x${ hex[3] }${hex[4]}`;
		blue = `0x${ hex[5] }${hex[6]}`;
	}

	// Then to HSL
	red /= 255;
	green /= 255;
	blue /= 255;

	const cmin = Math.min(red, green, blue),
		cmax = Math.max(red, green, blue),
		delta = cmax - cmin;
	let hue = 0,
		saturation = 0,
		lightness = 0;

	if (delta === 0) hue = 0;
	else if (cmax === red) hue = (green - blue) / delta % 6;
	else if (cmax === green) hue = ((blue - red) / delta) + 2;
	else hue = ((red - green) / delta) + 4;

	hue = Math.round(hue * 60);

	if (hue < 0) hue += 360;

	lightness = (cmax + cmin) / 2;
	saturation = delta === 0 ? 0 : delta / (1 - Math.abs((2 * lightness) - 1));
	saturation = Number((saturation * 100).toFixed(1));
	lightness = Number((lightness * 100).toFixed(1));

	return `${hue } ${ saturation }% ${ lightness }%`;
}

export function readable(HSL) {
	const parsedHSL = HSL.split(' ');
	const [hue] = parsedHSL;
	let [, saturation, lightness] = parsedHSL;

	saturation = saturation.replace('%', '');
	lightness = lightness.replace('%', '');
	saturation /= 100;
	lightness /= 100;
	if (lightness < 0.35) lightness += 1;
	else lightness -= 2;

	return `${hue } ${ saturation * 100 }% ${ lightness * 100 }%`;
}

export function darken(HSL) {
	const parsedHSL = HSL.split(' ');
	const [hue, saturation] = parsedHSL;
	let [, , lightness] = parsedHSL;

	lightness = lightness.replace('%', '');
	lightness /= 100;
	lightness -= 0.1;
	return `${hue } ${ saturation } ${ lightness * 100 }%`;
}

export function mono(HSL) {
	const parsedHSL = HSL.split(' ');
	const [hue] = parsedHSL;
	let [, saturation, lightness] = parsedHSL;

	saturation = saturation.replace('%', '');
	lightness = lightness.replace('%', '');
	saturation /= 100;
	lightness /= 100;
	saturation = 0;
	return `${hue } ${ saturation * 100 }% ${ lightness * 100 }%`;
}
