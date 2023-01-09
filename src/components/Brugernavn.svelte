<script>
  import BrugerDropdown from "./BrugerPopup.svelte";

  export let navn;
  export let id;

  export let className;
</script>

<div class="dropdown-right dropdown">
  <button tabindex="0" class="{className} hover:underline">{navn}</button>
  <div tabindex="0" class="dropdown-content rounded-box bg-base-100 p-2 shadow">
    <BrugerDropdown {navn} {id} />
  </div>
</div>
