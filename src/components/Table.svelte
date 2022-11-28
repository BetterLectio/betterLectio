<script>
  export let items;
</script>

<div>
  <div class="hidden md:block">
    <table class="mb-4 table w-full rounded-xl shadow-xl">
      <thead>
        <tr>
          {#each Object.entries(items) as [key, value]}
            <th>{key}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        <tr>
          {#each Object.entries(items) as [key, value]}
            <td>{value}</td>
          {/each}
        </tr>
      </tbody>
    </table>
  </div>

  <div class="block md:hidden">
    <ul class="menu rounded-box flex w-full bg-base-100 p-2">
      {#each Object.entries(items) as [key, value]}
        <li>
          <p><strong>{key}: </strong>{value}</p>
        </li>
      {/each}
    </ul>
  </div>
</div>
