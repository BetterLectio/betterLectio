<script>
    import { get } from "../../../components/http.js";
    import { studieretningspraesentation } from "../../../components/store.js";
  
    get("/studieretningspraesentation").then((data) => {
      $studieretningspraesentation = data;
    });
</script>

{#if $studieretningspraesentation}
    <p>{JSON.stringify($studieretningspraesentation)}</p>
{/if}