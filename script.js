let workouts = [];
let isTimerOn = false;
let timerInterval;

document.addEventListener("DOMContentLoaded", () => {
    hideEndWorkout();
    listWorkouts();
    if (isTimerOn) {
        beginWorkout();
    }
});

function addWorkout(event) {
    event.preventDefault();
    
    const workoutText = document.getElementById("workout_text").value;
    const workoutHours = document.getElementById("hours_interval").value;
    const workoutMinutes = document.getElementById("minutes_interval").value;
    const workoutSeconds = document.getElementById("seconds_interval").value;

    if (workoutText !== "" && workoutHours !== "" && workoutMinutes !== "" && workoutSeconds !== "") {
        const seconds = parseInt(workoutHours) * 3600 + parseInt(workoutMinutes) * 60 + parseInt(workoutSeconds);

        workouts.push({
            text: workoutText,
            seconds: seconds,
            completedSeconds: 0
        });

        workouts.push({
            text: 'Rest',
            seconds: 30,
            completedSeconds: 0
        });

        listWorkouts();
    }
}

function deleteWorkout(index) {
    workouts.splice(index, 1);
    listWorkouts();
}

function skipWorkout(index) {
    workouts[index].completedSeconds = workouts[index].seconds;
    listWorkouts();
}

function hideEndWorkout() {
    document.getElementById("show_end").style.visibility = isTimerOn ? 'visible' : 'hidden';
}

function listWorkouts() {
    const listContainer = document.getElementById("workouts");
    listContainer.innerHTML = workouts.map((workout, index) => {
        const remainingSeconds = workout.seconds - workout.completedSeconds;
        return `
            <div id='workout_card' class='workout_form'>
                <h3 class='workout_name'>${workout.text}</h3>
                <p class='workout_time' id='timer_display'>${formatTime(remainingSeconds)}</p>
                <div>
                    <button type='button' onclick='deleteWorkout(${index})' class='button'>Delete Workout</button>
                    <button type='button' onclick='skipWorkout(${index})' class='button'>Skip Workout</button>
                </div>
            </div>`;
    }).join("");
}

function beginWorkout() {
    if (workouts.length === 0) return;

    let index = 0;
    isTimerOn = true;
    hideEndWorkout();

    timerInterval = setInterval(() => {
        if (index >= workouts.length) {
            clearInterval(timerInterval);
            isTimerOn = false;
            hideEndWorkout();
            return;
        }
        if (workouts[index].completedSeconds >= workouts[index].seconds) {
            index++;
        } else {
            workouts[index].completedSeconds++;
            listWorkouts();
        }
    }, 1000);
}

function pauseWorkout() {
    isTimerOn = false;
    clearInterval(timerInterval);
}

function resumeWorkout() {
    if (!isTimerOn && workouts.length > 0) {
        beginWorkout();
    }
}

function resetWorkout() {
    workouts.forEach(workout => workout.completedSeconds = 0);
    pauseWorkout();
    hideEndWorkout();
    listWorkouts();
}

function formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
}