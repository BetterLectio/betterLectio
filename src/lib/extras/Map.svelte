<script lang="ts">
	import { VisLeafletMap } from "@unovis/svelte";

	// Fuck it
	const style = `https://api.maptiler.com/maps/663c6180-5c83-4a2b-91c5-380c2529de67/style.json?key=NwlkZIngfV6vA8dbg6j9`;
	const attribution = [
		`<a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>`,
		`<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>`
	];

	// maybe hook up to db in future idc
	let data = [
		{
			id: 51,
			name: "Allerød Gymnasium",
			latitude: 55.86531,
			longitude: 12.33416
		},
		{
			id: 1,
			name: "Aurehøj Gymnasium",
			latitude: 55.745477,
			longitude: 12.545043
		},
		{
			id: 3,
			name: "Bagsværd Kostskole og Gymnasium",
			latitude: 55.764517,
			longitude: 12.451367
		},
		{
			id: 52,
			name: "Birkerød Gymnasium og HF",
			latitude: 55.838851,
			longitude: 12.438811
		},
		{
			id: 37,
			name: "Borupgaard Gymnasium",
			latitude: 55.735741,
			longitude: 12.382689
		},
		{
			id: 5,
			name: "Christianshavns Gymnasium",
			latitude: 55.673243,
			longitude: 12.595452
		},
		{
			id: 57,
			name: "Espergærde Gymnasium og HF",
			latitude: 55.999043,
			longitude: 12.531902
		},
		{
			id: 319,
			name: "EUC Nord – HHX-HTX-EUD-AMU",
			latitude: 55.779582,
			longitude: 12.533987
		},
		{
			id: 7,
			name: "Falkonergårdens Gymnasium og HF",
			latitude: 55.681596,
			longitude: 12.496122
		},
		{
			id: 9,
			name: "Gammel Hellerup Gymnasium",
			latitude: 55.730633,
			longitude: 12.573467
		},
		{
			id: 17,
			name: "Gefion Gymnasium",
			latitude: 55.688359,
			longitude: 12.581447
		},
		{
			id: 304,
			name: "Gentofte Gymnasium",
			latitude: 55.743276,
			longitude: 12.566521
		},
		{
			id: 11,
			name: "Gladsaxe Gymnasium",
			latitude: 55.742878,
			longitude: 12.49046
		},
		{
			id: 241,
			name: "Grenaa Gymnasium",
			latitude: 56.408013,
			longitude: 10.888835
		},
		{
			id: 680,
			name: "H.C. Ørsted Gymnasiet - Ballerup",
			latitude: 55.733054,
			longitude: 12.342349
		},
		{
			id: 679,
			name: "H.C. Ørsted Gymnasiet - Frederiksberg",
			latitude: 55.682869,
			longitude: 12.519146
		},
		{
			id: 681,
			name: "H.C. Ørsted Gymnasiet - Lyngby",
			latitude: 55.777856,
			longitude: 12.526219
		},
		{
			id: 163,
			name: "Haderslev Katedralskole",
			latitude: 55.2585897,
			longitude: 9.4929714
		},
		{
			id: 511,
			name: "Handelsgymnasiet Vestfyn",
			latitude: 55.272303,
			longitude: 10.111308
		},
		{
			id: 53,
			name: "Helsingør Gymnasium",
			latitude: 56.02264,
			longitude: 12.5848
		},
		{
			id: 12,
			name: "Herlev Gymnasium og HF",
			latitude: 55.732122,
			longitude: 12.418841
		},
		{
			id: 111,
			name: "Herlufsholm Skole",
			latitude: 55.245816,
			longitude: 11.746338
		},
		{
			id: 222,
			name: "Holstebro Gymnasium og HF",
			latitude: 56.369817,
			longitude: 8.604649
		},
		{
			id: 202,
			name: "Horsens Gymnasium & HF",
			latitude: 55.871377,
			longitude: 9.826707
		},
		{
			id: 280,
			name: "Hovedstadens Kristne Gymnasium",
			latitude: 55.6853532,
			longitude: 12.4867912
		},
		{
			id: 523,
			name: "HTX Roskilde",
			latitude: 55.625262,
			longitude: 12.082808
		},
		{
			id: 36,
			name: "Høje-Taastrup Gymnasium",
			latitude: 55.649059,
			longitude: 12.262488
		},
		{
			id: 223,
			name: "Ikast-Brande Gymnasium",
			latitude: 56.135412,
			longitude: 9.127197
		},
		{
			id: 13,
			name: "Ingrid Jespersens Gymnasieskole",
			latitude: 55.700287,
			longitude: 12.578547
		},
		{
			id: 16,
			name: "Johannesskolens Gymnasium",
			latitude: 55.67504,
			longitude: 12.501831
		},
		{
			id: 32,
			name: "Københavns åbne Gymnasium",
			latitude: 55.655582,
			longitude: 12.524251
		},
		{
			id: 305,
			name: "Learnmark Horsens Teknisk Gymnasium HTX",
			latitude: 55.868407,
			longitude: 9.855812
		},
		{
			id: 58,
			name: "Marie Kruses Skole",
			latitude: 55.814328,
			longitude: 12.386947
		},
		{
			id: 955,
			name: "Midtfyns Gymnasium",
			latitude: 55.241256,
			longitude: 10.467905
		},
		{
			id: 207,
			name: "Munkensdam Gymnasium",
			latitude: 55.485517,
			longitude: 9.456392
		},
		{
			id: 19,
			name: "N. Zahles Gymnasieskole",
			latitude: 55.682456,
			longitude: 12.569828
		},
		{
			id: 520,
			name: "NEXT - Københavns Mediegymnasium",
			latitude: 55.6818269,
			longitude: 12.5537159
		},
		{
			id: 518,
			name: "NEXT - Sukkertoppen Gymnasium",
			latitude: 55.654338,
			longitude: 12.515746
		},
		{
			id: 519,
			name: "NEXT - Vibenshus Gymnasium",
			latitude: 55.704946,
			longitude: 12.560443
		},
		{
			id: 20,
			name: "Niels Steensens Gymnasium",
			latitude: 55.708128,
			longitude: 12.567054
		},
		{
			id: 144,
			name: "Nyborg Gymnasium",
			latitude: 55.322377,
			longitude: 10.79522
		},
		{
			id: 31,
			name: "Nærum Gymnasium",
			latitude: 55.819045,
			longitude: 12.533154
		},
		{
			id: 21,
			name: "Nørre Gymnasium",
			latitude: 55.718373,
			longitude: 12.471338
		},
		{
			id: 22,
			name: "Ordrup Gymnasium",
			latitude: 55.759934,
			longitude: 12.575718
		},
		{
			id: 73,
			name: "Roskilde Gymnasium",
			latitude: 55.6420031,
			longitude: 12.0777284
		},
		{
			id: 23,
			name: "Rysensteen Gymnasium",
			latitude: 55.670167,
			longitude: 12.563467
		},
		{
			id: 24,
			name: "Rødovre Gymnasium",
			latitude: 55.667133,
			longitude: 12.457519
		},
		{
			id: 25,
			name: "Sankt Annæ Gymnasium",
			latitude: 55.656085,
			longitude: 12.525845
		},
		{
			id: 557,
			name: "Slotshaven Gymnasium",
			latitude: 55.713063,
			longitude: 11.702584
		},
		{
			id: 74,
			name: "Solrød Gymnasium",
			latitude: 55.533317,
			longitude: 12.213871
		},
		{
			id: 95,
			name: "Stenhus Gymnasium",
			latitude: 55.71154,
			longitude: 11.682178
		},
		{
			id: 224,
			name: "Struer Statsgymnasium",
			latitude: 56.490602,
			longitude: 8.601241
		},
		{
			id: 477,
			name: "Svendborg Gymnasium",
			latitude: 55.053403,
			longitude: 10.589702
		},
		{
			id: 208,
			name: "Tørring Gymnasium",
			latitude: 55.863357,
			longitude: 9.484427
		},
		{
			id: 30,
			name: "Tårnby Gymnasium",
			latitude: 55.637586,
			longitude: 12.604097
		},
		{
			id: 240,
			name: "UNORD Hillerød Handelsgymnasium og Handelsskole",
			latitude: 55.925841,
			longitude: 12.283352
		},
		{
			id: 236,
			name: "UNORD Hillerød Teknisk Gymnasium",
			latitude: 55.920765,
			longitude: 12.291219
		},
		{
			id: 265,
			name: "Viborg Katedralskole",
			latitude: 56.457336,
			longitude: 9.412118
		},
		{
			id: 33,
			name: "Virum Gymnasium",
			latitude: 55.79057,
			longitude: 12.479623
		},
		{
			id: 168,
			name: "ZBC Slagelse EUD/AMU",
			latitude: 55.4041994,
			longitude: 11.3357472
		},
		{
			id: 34,
			name: "Øregård Gymnasium",
			latitude: 55.737943,
			longitude: 12.566701
		},
		{
			id: 26,
			name: "Ørestad Gymnasium",
			latitude: 55.631753,
			longitude: 12.581043
		},
		{
			id: 166,
			name: "Aabenraa Statsskole",
			latitude: 55.045063,
			longitude: 9.411558
		},
		{
			id: 289,
			name: "Aalborg Katedralskole",
			latitude: 57.048086,
			longitude: 9.911352
		}
	];
</script>

<VisLeafletMap
	clusterExpandOnClick={false}
	{style}
	{attribution}
	{data}
	pointBottomLabel={(d) => d.name}
	pointRadius={5}
	clusteringDistance={0}
	pointColor="#5865f1"
/>
