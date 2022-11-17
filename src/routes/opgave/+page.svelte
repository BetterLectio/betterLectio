<script>
  import { page } from "$app/stores";
  import { get } from "../../components/http.js";

  const exerciseid = $page.url.searchParams.get("exerciseid");
</script>

<p>exerciseid={exerciseid}</p>
