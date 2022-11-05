<script>
    import FullCalendar from 'svelte-fullcalendar';
    import timeGridPlugin from '@fullcalendar/timegrid';
    import daLocale from '@fullcalendar/core/locales/da';
    
    let options = {
        initialView: 'timeGridWeek',
        plugins: [ timeGridPlugin ],
        weekNumberCalculation: "ISO",
        locale: daLocale,
        weekends: false,
        
        slotMinTime: "08:00:00",
        slotMaxTime: "18:00:00",

        slotDuration: "00:30:00",

        dateClick: (event) => alert('date click! ' + event.dateStr),
        events: [
            {
                title: 'Ting sker',
                defaultAllDay: true,
                date: "2022-11-02"
            }
        ],
        timeFormat: 'H(:mm)' // uppercase H for 24-hour clock
    };

    let skema = '';

    let checked = false;
    function checkIfAuthed() {
        if (localStorage.getItem("authentication") == null) {
            console.log("Redirect")
            window.location.href = "/";
        } else {
            checked = true;
        }

        fåSkema()
    }
    async function fåSkema() {
        const response = await fetch(
            `https://better-lectio-flask-backend.vercel.app/skema?cookie=${localStorage.getItem("authentication")}`
        );
        skema = await response.json()
        skema["moduler"].forEach(function(modul){
            let start = modul["tidspunkt"].split(" til ")[0]
            start = {
                dag: (start.split("/")[0].length == 1) ? "0" + start.split("/")[0] : start.split("/")[0],
                måned: (start.split("/")[1].split("-")[0].length == 1) ? "0" + start.split("/")[1].split("-")[0] : start.split("/")[1].split("-")[0],
                år: start.split("-")[1].split(" ")[0],

                tidspunkt: start.split(" ")[1]
            }
            let slut = modul["tidspunkt"].split(" ")[0] + " " + modul["tidspunkt"].split(" til ")[1]
            slut = {
                dag: slut.split("/")[0],
                måned: slut.split("/")[1].split("-")[0],
                år: slut.split("-")[1].split(" ")[0],

                tidspunkt: slut.split(" ")[1]
            }
            console.log(`${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}:00`, `${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}:00`)
            options["events"].push({ 
                title: modul["hold"], 
                start: `${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}:00`,
                end: `${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}:00`,
            });
        });

    }
    function toggleWeekends() {
        options = {
        ...options,
        weekends: !options.weekends
        };
    }
</script>

<h1 class="text-3xl font-bold">Skema</h1>
<br />
<body use:checkIfAuthed>
    {#if skema != ''}
        <FullCalendar {options} />
        <div>
            <p>{JSON.stringify(skema)}</p>
        </div>
    {/if}
</body>
