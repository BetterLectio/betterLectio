// TODO: Tilføj de andre alerts fra https://daisyui.com/components/alert/

export function normal(besked, seconds = null) {
	const alerts = document.getElementById('alerts');
	const alert = document.createElement('div');
	alert.className = 'alert shadow-lg animate-fade-in-down mt-4';
	const id = Math.floor(Math.random() * 100000);
	alert.id = id;
	alert.innerHTML = `<div>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <span>${besked}</span>
  </div>`;
	alerts.appendChild(alert);

	if (seconds !== null) setTimeout(document.getElementById(id).remove, seconds * 1000);
}
