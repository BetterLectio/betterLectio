<script>
  import { addNotification } from "../../components/notifyStore.js";

  addNotification("Dette er en mindre ond besked", "alert-warning");
</script>

<p
on:click={() => {
  addNotification(`dette er ${Math.random()}`, "alert-warning");
} }
>test</p>