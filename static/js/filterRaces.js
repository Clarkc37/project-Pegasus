// static/js/filterRaces.js
function filterRaces() {
    const selectedRace = document.getElementById("raceSelector").value;
    const races = document.querySelectorAll(".race");

    races.forEach((race) => {
        if (race.id === selectedRace) {
            race.classList.remove("hidden");
        } else {
            race.classList.add("hidden");
        }
    });
}