<script>
  import { onMount } from "svelte";
  import { get } from "../../components/http";
  import { skema } from "../../components/store";
  import Calendar from "@event-calendar/core"; 
  import timeGrid from "@event-calendar/time-grid";
  import { addNotification } from "../../components/notifyStore";
  addNotification("Skema siden er stadig under udvikling", "alert-warning");
</script>

<div class="bg-gray-900 rounded-lg p-4">
  <Calendar/>
</div>


