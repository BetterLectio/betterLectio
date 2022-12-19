<script>
  import BrugerDropdown from "./BrugerPopup.svelte";

  export let navn;
  export let id;

  export let className;
</script>

<div class="dropdown dropdown-right">
  <button tabindex="0" class="{className} hover:underline">{navn}</button>
  <div tabindex="0" class="dropdown-content p-2 shadow bg-base-100 rounded-box">
    <BrugerDropdown navn={navn} id={id}/>
  </div>
</div>