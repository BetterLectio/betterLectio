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
            },
            { 
                title: 'event 1', 
                start: '2022-11-01T14:30:00',
                end: '2022-11-01T15:30:00',
            },
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
<FullCalendar {options} />
<body use:checkIfAuthed>
    {#if skema != ''}
        <div>
            <p>{JSON.stringify(skema)}</p>
        </div>
    {/if}
</body>
