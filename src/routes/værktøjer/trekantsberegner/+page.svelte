<script>
	const semicircle = 180;
	const rightTriangleC = 90;

	let isCalculatible = false;

	let sideA = null;
	let sideB = null;
	let sideC = null;
	let angleA = null;
	let angleB = null;
	let angleC = rightTriangleC;

	function reset() {
		// this function resets all the values
		sideA = undefined;
		sideB = undefined;
		sideC = undefined;
		angleA = undefined;
		angleB = undefined;
		angleC = rightTriangleC;
	}

	function checkAngles() {
		// this function checks if the angles are valid and returns true or false depending on the result
		if (angleA === undefined || angleB === undefined || angleC === undefined || angleA === null || angleB === null || angleC === null) {
			if (angleA !== undefined || angleB !== undefined || angleC !== undefined || angleA !== null || angleB !== null || angleC !== null) return true;

			return false;
		}

		if (angleA + angleB + angleC === semicircle) return true;

		return false;
	}

	function checkIfCorrectAmountOfDataIsFilled() {
		// this function checks if at least 3 properties are filled out one of which must be a side
		let count = 0;
		let sideCount = 0;
		if (sideA !== undefined || sideA !== null) {
			count++;
			sideCount++;
		}
		if (sideB !== undefined || sideB !== null) {
			count++;
			sideCount++;
		}
		if (sideC !== undefined || sideC !== null) {
			count++;
			sideCount++;
		}
		if (angleA !== undefined || angleA !== null) count++;

		if (angleB !== undefined || angleB !== null) count++;

		if (angleC !== undefined || angleC !== null) count++;


		if (count >= 3 && sideCount >= 1) return true;

		return false;
	}

	function checkSides() {
		// using pythagoras' theorem, this function checks if the sides are valid and returns true or false depending on the result
		if (sideA === undefined || sideB === undefined || sideC === undefined || sideA === null || sideB === null || sideC === null) return true;


		if (Math.pow(sideA, 2) + Math.pow(sideB, 2) === Math.pow(sideC, 2)) return true;

		return false;
	}

	let areSidesValid = true;
	let areAnglesValid = true;
	let isCorrectAmountOfDataIsFilled = false;
	function checkData() {
		if (checkAngles()) areAnglesValid = true;
		else areAnglesValid = false;

		if (checkIfCorrectAmountOfDataIsFilled()) isCorrectAmountOfDataIsFilled = true;
		else isCorrectAmountOfDataIsFilled = false;


		if (checkSides()) areSidesValid = true;
		else areSidesValid = false;


		if (areAnglesValid && isCorrectAmountOfDataIsFilled && areSidesValid) isCalculatible = true;
		else isCalculatible = false;
	}

	function calculate() {
		if (!isCalculatible) return;

		let hash = '';
		if (!(sideA === undefined || sideA === null)) hash += 'a';

		if (!(sideB === undefined || sideB === null)) hash += 'b';

		if (!(sideC === undefined || sideC === null)) hash += 'c';

		if (!(angleA === undefined || angleA === null)) hash += 'A';

		if (!(angleB === undefined || angleB === null)) hash += 'B';

		if (!(angleC === undefined || angleC === null)) hash += 'C';

		// the hash is used to determine which values are determined and which are not and which values are needed to calculate the missing values
		console.log('hash', hash);

		switch (hash) {
		case 'aAC':
			sideC = sideA / Math.sin(angleA * Math.PI / semicircle);
			sideB = sideA / Math.tan(angleA * Math.PI / semicircle);
			angleB = semicircle - angleA - angleC;
			break;
		case 'aBC':
			angleA = semicircle - angleB - angleC;
			sideC = sideA / Math.sin(angleA * Math.PI / semicircle);
			sideB = sideA / Math.tan(angleA * Math.PI / semicircle);
			break;
		case 'aABC':
			sideC = sideA / Math.sin(angleA * Math.PI / semicircle);
			sideB = sideA / Math.tan(angleA * Math.PI / semicircle);
			break;
		case 'bAC':
			sideA = sideB * Math.tan(angleA * Math.PI / semicircle);
			sideC = sideB / Math.cos(angleA * Math.PI / semicircle);
			angleB = semicircle - angleA - angleC;
			break;
		case 'bBC':
			angleA = semicircle - angleB - angleC;
			sideA = sideB * Math.tan(angleA * Math.PI / semicircle);
			sideC = sideB / Math.cos(angleA * Math.PI / semicircle);
			break;
		case 'bABC':
			sideA = sideB * Math.tan(angleA * Math.PI / semicircle);
			sideC = sideB / Math.cos(angleA * Math.PI / semicircle);
			break;
		case 'cAC':
			sideA = sideC * Math.sin(angleA * Math.PI / semicircle);
			sideB = sideC * Math.cos(angleA * Math.PI / semicircle);
			angleB = semicircle - angleA - angleC;
			break;
		case 'cBC':
			angleA = semicircle - angleB - angleC;
			sideA = sideC * Math.sin(angleA * Math.PI / semicircle);
			sideB = sideC * Math.cos(angleA * Math.PI / semicircle);
			break;
		case 'cABC':
			sideA = sideC * Math.sin(angleA * Math.PI / semicircle);
			sideB = sideC * Math.cos(angleA * Math.PI / semicircle);
			break;
		case 'abC':
			sideC = Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
			angleA = Math.asin(sideA / sideC) * semicircle / Math.PI;
			angleB = Math.asin(sideB / sideC) * semicircle / Math.PI;
			break;
		case 'acC':
			sideB = Math.sqrt(Math.pow(sideC, 2) - Math.pow(sideA, 2));
			angleA = Math.asin(sideA / sideC) * semicircle / Math.PI;
			angleB = Math.asin(sideB / sideC) * semicircle / Math.PI;
			break;
		case 'bcC':
			sideA = Math.sqrt(Math.pow(sideC, 2) - Math.pow(sideB, 2));
			angleA = Math.asin(sideA / sideC) * semicircle / Math.PI;
			angleB = Math.asin(sideB / sideC) * semicircle / Math.PI;
			break;
		case 'abcC':
			angleA = Math.asin(sideA / sideC) * semicircle / Math.PI;
			angleB = Math.asin(sideB / sideC) * semicircle / Math.PI;
			break;
		case 'abcAC':
			angleB = Math.asin(sideB / sideC) * semicircle / Math.PI;
			break;
		case 'abcBC':
			angleA = Math.asin(sideA / sideC) * semicircle / Math.PI;
			break;
		case 'abcABC':
			break;
		case 'abAC':
			sideC = Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
			angleB = Math.asin(sideB / sideC) * semicircle / Math.PI;
			break;
		case 'abBC':
			sideC = Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
			angleA = Math.asin(sideA / sideC) * semicircle / Math.PI;
			break;
		case 'abABC':
			sideC = Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
			break;
		case 'acAC':
			sideB = Math.sqrt(Math.pow(sideC, 2) - Math.pow(sideA, 2));
			angleB = Math.asin(sideB / sideC) * semicircle / Math.PI;
			break;
		case 'acBC':
			sideB = Math.sqrt(Math.pow(sideC, 2) - Math.pow(sideA, 2));
			angleA = Math.asin(sideA / sideC) * semicircle / Math.PI;
			break;
		case 'acABC':
			sideB = Math.sqrt(Math.pow(sideC, 2) - Math.pow(sideA, 2));
			break;
		case 'bcAC':
			sideA = Math.sqrt(Math.pow(sideC, 2) - Math.pow(sideB, 2));
			angleB = Math.asin(sideB / sideC) * semicircle / Math.PI;
			break;
		case 'bcBC':
			sideA = Math.sqrt(Math.pow(sideC, 2) - Math.pow(sideB, 2));
			angleA = Math.asin(sideA / sideC) * semicircle / Math.PI;
			break;
		case 'bcABC':
			sideA = Math.sqrt(Math.pow(sideC, 2) - Math.pow(sideB, 2));
			break;
		default:
			break;
		}
	}

	// if any of the values change, the function checkData() is called
	$: if (
		sideA !== undefined
			|| sideB !== undefined
			|| sideC !== undefined
			|| angleA !== undefined
			|| angleB !== undefined
			|| angleC !== undefined
			|| sideA !== null
			|| sideB !== null
			|| sideC !== null
			|| angleA !== null
			|| angleB !== null
			|| angleC !== null
	) checkData();
</script>

<h1 class="heading">Trekantsberegner</h1>

{#if !isCorrectAmountOfDataIsFilled}
	<div class="alert alert-error mb-2 shadow-lg">
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
			>
			<span>Ikke nok data!</span>
		</div>
	</div>
{/if}
{#if !areAnglesValid}
	<div class="alert alert-error mb-2 shadow-lg">
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
			>
			<span>Alle vinkler angivet, men vinkelsummen er ikke semicircle°</span>
		</div>
	</div>
{/if}
{#if !areSidesValid}
	<div class="alert alert-warning mb-2 shadow-lg">
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/></svg
			>
			<span>Alle sider angivet, men Pythagoras' læresætning er ikke opfyldt (a² + b² = c²)</span>
		</div>
	</div>
{/if}

<div class="flex w-full flex-row rounded-lg p-4">
	<div class="w-full">
		<p>Sider</p>
		<div class="form-control m-2">
			<label class="input-group-md input-group">
				<span>a</span>
				<input
					type="number"
					placeholder="a"
					id="a"
					bind:value={sideA}
					class="input-bordered input w-full max-w-xs
						{isCorrectAmountOfDataIsFilled === false && (sideA === null || isCorrectAmountOfDataIsFilled === false) && sideA === undefined
							? 'border-error'
							: ''}
						{areSidesValid === false ? 'border-warning' : ''}"
				/>
			</label>
		</div>
		<div class="form-control m-2">
			<label class="input-group-md input-group">
				<span>b</span>
				<input
					type="number"
					placeholder="b"
					id="b"
					bind:value={sideB}
					class="input-bordered input w-full max-w-xs
						{isCorrectAmountOfDataIsFilled === false && (sideB === null || isCorrectAmountOfDataIsFilled === false) && sideB === undefined
							? 'border-error'
							: ''}
						{areSidesValid === false ? 'border-warning' : ''}"
				/>
			</label>
		</div>
		<div class="form-control m-2">
			<label class="input-group-md input-group">
				<span>c</span>
				<input
					type="number"
					placeholder="c"
					id="c"
					bind:value={sideC}
					class="input-bordered input w-full max-w-xs
						{isCorrectAmountOfDataIsFilled === false && (sideC === null || isCorrectAmountOfDataIsFilled === false) && sideC === undefined
							? 'border-error'
							: ''}
						{areSidesValid === false ? 'border-warning' : ''}"
				/>
			</label>
		</div>
	</div>

	<div class="w-full">
		<p>Vinkler</p>
		<div class="form-control m-2">
			<label class="input-group-md input-group">
				<span>A</span>
				<input
					type="number"
					placeholder="A"
					id="A"
					bind:value={angleA}
					class="input-bordered input w-full max-w-xs
						{isCorrectAmountOfDataIsFilled === false && (angleA === null || isCorrectAmountOfDataIsFilled === false) && angleA === undefined
							? 'border-error'
							: ''}
						{areAnglesValid === false ? 'border-error' : ''}"
				/>
			</label>
		</div>
		<div class="form-control m-2">
			<label class="input-group-md input-group">
				<span>B</span>
				<input
					type="number"
					placeholder="B"
					id="B"
					bind:value={angleB}
					class="input-bordered input w-full max-w-xs
						{isCorrectAmountOfDataIsFilled === false && (angleB === null || isCorrectAmountOfDataIsFilled === false) && angleB === undefined
							? 'border-error'
							: ''}
						{areAnglesValid === false ? 'border-error' : ''}"
				/>
			</label>
		</div>
		<div class="form-control m-2">
			<label class="input-group-md input-group">
				<span>C</span>
				<input
					type="number"
					placeholder="C"
					bind:value={angleC}
					disabled
					id="C"
					class="input-bordered input w-full max-w-xs
						{isCorrectAmountOfDataIsFilled === false && (angleC === null || isCorrectAmountOfDataIsFilled === false) && angleC === undefined
							? 'border-error'
							: ''}
						{areAnglesValid === false ? 'border-error' : ''}"
				/>
			</label>
		</div>
	</div>
</div>

<div class="flex flex-row">
	<button class="btn-primary btn mt-2" on:click={() => calculate()}>Beregn</button>
	<button class="btn mt-2 ml-2" on:click={() => reset()}>Nulstil</button>
</div>
