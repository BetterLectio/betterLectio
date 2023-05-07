<script>
  export let items;
</script>

<div class="mb-4 mt-2">
  <div class="hidden md:block">
    <table class="table w-full rounded-xl shadow-xl">
      <thead>
        <tr>
          {#each Object.entries(items) as [key, value]}
            {#if key && value}
              <th>{key}</th>
            {/if}
          {/each}
        </tr>
      </thead>
      <tbody>
        <tr>
          {#each Object.entries(items) as [key, value]}
            {#if key && value}
              <td>{value}</td>
            {/if}
          {/each}
        </tr>
      </tbody>
    </table>
  </div>

  <div class="block md:hidden">
    <ul class="menu rounded-box w-full bg-base-100 p-2 drop-shadow-xl md:w-56">
      {#each Object.entries(items) as [key, value]}
        {#if key && value}
          <li>
            <p><strong>{key}: </strong>{value}</p>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
</div>
