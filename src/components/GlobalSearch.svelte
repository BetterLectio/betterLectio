<script>
  import { get } from "../components/http.js";
  import {
    brugeren,
    nyheder,
    lektier,
    forside,
    skema,
    beskeder,
    fravaer,
    dokumenter,
    informationer,
  } from "../components/store.js";

  import { fade } from "svelte/transition";
</script>

<!-- <GlobalSearch /> -->
<input type="text" placeholder="Indlæser data..." class="input input-bordered bg-base-300 input-primary w-fit" />

