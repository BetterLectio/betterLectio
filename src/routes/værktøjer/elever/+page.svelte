<script>
  import Avatar from "../../../components/Avatar.svelte";
  import Brugernavn from "../../../components/Brugernavn.svelte";
  import { get } from "../../../components/http";
  import { informationer } from "../../../components/store";
  import InfiniteLoading from "svelte-infinite-loading";

  let ready = false;
  let elevObjArray = [];
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
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      elevObjArray.push({ navn: navn, id: value });
    }
    ready = true;
  });

  let page = 1;
  let list = [];

  function infiniteHandler({ detail: { loaded, complete } }) {
    let data = elevObjArray.slice((page - 1) * 10, page * 10);
    if (data.length) {
      page += 1;
      list = [...list, ...data];
      loaded();
    } else {
      complete();
    }
  }
</script>

<h1 class="mb-4 text-3xl font-bold">Elev liste</h1>

<div class="tabs tabs-boxed w-fit">
  <a href="#" class="tab">Lærere</a>
  <a href="#" class="tab tab-active">Elever</a>
  <a href="#" class="tab">Klasser</a>
  <a href="#" class="tab">Lokaler</a>
</div>

{#if ready}
  {#each list as elev}
    <div class="flex items-center">
      <div class="ml-4 mb-4">
        <Brugernavn className="text-xl font-bold" navn={elev.navn} id={elev.id} />
      </div>
    </div>
  {/each}

  <InfiniteLoading on:infinite={infiniteHandler} />
{/if}
