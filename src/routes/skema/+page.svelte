<script> 
    /*
    TODO:
        - Vælg skema ud fra næste skole dag
        - Tag weekend med hvis der sker noget der
        - Få uge nummer og år fra alle muligheder på skema og load skemaet ud fra det
        - Giv flere informationer på modulerne
        - Gør modulerne klikbare
        - Skriv når et modul er annuleret
        - Hav farver fra lectio med, f.eks. grøn=frivillig
        - Gør skemaet mobilt venligt ved kun at vise en dag i stedet for en hel uge
    */
    import FullCalendar from 'svelte-fullcalendar';
    import timeGridPlugin from '@fullcalendar/timegrid';
    import daLocale from '@fullcalendar/core/locales/da';



    let calendar;
    let calendarApi;
    
    let options = {
        initialView: 'timeGridWeek',
        plugins: [ timeGridPlugin ],
        weekNumberCalculation: "ISO",
        locale: daLocale,
        weekends: false,
        
        slotMinTime: "08:00:00",
        slotMaxTime: "18:00:00",

        slotDuration: "00:30:00",

        events: [],
        /*eventClick: function(info) {
            alert('Event: ' + info.event.title);
        },*/
        eventMouseEnter: function(info) {
            console.log("Mus over: " + info.event.title);
            // Popup af en eller andet form som fortæller mere om modulet
        },
        eventMouseLeave: function(info) {
            console.log("Mus ikke længere over: " + info.event.title);
            // Fjern pop up 
            
        }
    };

    let skema = '';

    let checked = false;
    async function checkIfAuthed() {
        if (localStorage.getItem("authentication") == null) {
            console.log("Redirect")
            window.location.href = "/auth";
        } else {
            const response = await fetch(
                `https://better-lectio-flask-backend.vercel.app/check-cookie?cookie=${localStorage.getItem("authentication")}`
            );
            if (await response.json()["valid"] == false) {
                console.log("Redirect")
                window.location.href = "/auth";
            }
        }

        viewChanged()
    }


    Date.prototype.getWeekNumber = function(){
        var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
    };

    let loadedWeeks = []
    function viewChanged() {
        let date = calendarApi.getDate()
        
        let år = date.getFullYear()
        let ugeNummer = date.getWeekNumber()

        if (!loadedWeeks.includes(`${ugeNummer}, ${år}`)) {
            fåSkema(ugeNummer, år)

            loadedWeeks.push(`${ugeNummer}, ${år}`)
            console.log(loadedWeeks)
        }
    }

    async function fåSkema(ugeNummer, år) {
        const response = await fetch(
            `https://better-lectio-flask-backend.vercel.app/skema?uge=${ugeNummer}&år=${år}&cookie=${localStorage.getItem("authentication")}`
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
                dag: (slut.split("/")[0].length == 1) ? "0" + slut.split("/")[0] : slut.split("/")[0],
                måned: (slut.split("/")[1].split("-")[0].length == 1) ? "0" + slut.split("/")[1].split("-")[0] : slut.split("/")[1].split("-")[0],
                år: slut.split("-")[1].split(" ")[0],

                tidspunkt: slut.split(" ")[1]
            }
            calendarApi.addEvent({ 
                title: modul["hold"], 
                url: `/modul?absid=${modul["absid"]}`,
                start: `${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}:00`,
                end: `${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}:00`,
                defaultAllDay: false,
            });
        });
        loadDagsNoter()
    }

    async function loadDagsNoter() {
        let year = calendarApi.getDate().getFullYear()
        skema["dagsNoter"].forEach(function(dagsNoter){
            Object.entries(dagsNoter).forEach(([key, value]) => {
                let day = (key.split("(")[1].split("/")[0].length == 1) ? "0" + key.split("(")[1].split("/")[0] : key.split("(")[1].split("/")[0]
                let month = (key.split("(")[1].split("/")[1].slice(0, -1).length == 1) ? "0" + key.split("(")[1].split("/")[1].slice(0, -1) : key.split("(")[1].split("/")[1].slice(0, -1)
                value.forEach(function(dagsNote){
                    calendarApi.addEvent({
                        title: dagsNote,
                        defaultAllDay: true,
                        date: `${year}-${month}-${day}`
                    });
                })
            });
        });
    }

    function toggleWeekends() {
        options = {
        ...options,
        weekends: !options.weekends
        };
    }


    async function bindCalendar() {
        while (true) {
            if (calendar != undefined) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        calendarApi = await calendar.getAPI();
        
        let today = await new Date().getDay();
        if (today == 6 || today == 0) {
            calendarApi.next()
        }
        
        const fcButtons = await document.getElementsByClassName('fc-button-primary');
        for (var i = 0; i < fcButtons.length; i++) {
            await fcButtons[i].addEventListener("click", viewChanged);
        }
    }
    bindCalendar()
</script>

<h1 class="text-3xl font-bold">Skema</h1>
<br />
<FullCalendar bind:this={calendar} {options}/>
<body use:checkIfAuthed>
    {#if skema != ''}
        <div>
            <p>{JSON.stringify(skema)}</p>
        </div>
    {/if}
</body>
