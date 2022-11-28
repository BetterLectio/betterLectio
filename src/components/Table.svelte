<script>
  export let data;
</script>

<div class="hidden md:block">
  <table class="mb-4 table w-full rounded-xl shadow-xl">
    <thead>
      <tr>
        {#each Object.entries(data) as [key, value]}
          <th>{key}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      <tr>
        {#each Object.entries(data) as [key, value]}
          <td>{value}</td>
        {/each}
      </tr>
    </tbody>
  </table>
</div>

<div class="block md:hidden">
  <ul class="menu rounded-box flex w-full bg-base-100 p-2">
    <li>
      {#each Object.entries(data) as [key, value]}
      <p><strong>{key}: </strong>{value}</p>
      {/each}
    </li>
  </ul>
</div>