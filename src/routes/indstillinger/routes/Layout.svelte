<script>
  import { instillinger } from "../../../components/store";

  if ($instillinger == null) {
    $instillinger = {
      sidebar: true,
    }
  }
</script>

<h1 class="mb-4 text-3xl font-bold">Indstillinger - Layout</h1>

<div class="p-4 bg-base-200 rounded-lg">
  <div class="form-control">
    <p>Skift imellem sidebar og topbar layout</p>
    <label class="label cursor-pointer">
      <span class="label-text">Sidebar</span> 
      <input type="checkbox" class="checkbox" bind:checked={$instillinger.sidebar}/>
    </label>
  </div>

</div>