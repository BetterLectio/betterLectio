<script>
  import { get } from "../../components/http";
  import { informationer } from "../../components/store";

  get("/informationer").then((data) => {
    $informationer = data;
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      _elever[navn] = value;
    }
    $informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };
  });
</script>


<h1 class="mb-4 text-3xl font-bold">Elev liste</h1>

<div class="tabs tabs-boxed w-fit">
  <a href="#" class="tab">Lærere</a> 
  <a href="#" class="tab tab-active">Elever</a>
  <a href="#" class="tab">Klasser</a>
  <a href="#" class="tab">Lokaler</a>
</div>