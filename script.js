class Process {
    letructor(nome, tArrivo, tBurst) {
        this.nome = nome;
        this.tArrivo = tArrivo;
        this.tBurst = tBurst;
        this.remainTBurst = tBurst;
        this.isRunning = false;
        this.latency = 0;
    }

    getState() {
        if (t < this.tArrivo) return "New";
        else if (this.remainTBurst === 0) return "Terminated";
        else if (this.isRunning) return "Running";
        else return "Ready";
    }

    canRun() {
        return t >= this.tArrivo && this.remainTBurst > 0;
    }

    getLatency() {
        return this.latency;
    }
}

let process = [];
let currentProcess;
let t;

process.push(new Process("P1", 3, 2));
process.push(new Process("P2", 2, 4));
process.push(new Process("P3", 5, 2));

function reset() {
    let tableEl = document.getElementById("idTable");
    let oldTBodyEl = tableEl.getElementsByTagName("tbody")[0];
    let newTBodyEl = document.createElement("tbody");

    t = 0;
    currentProcess = null;

    process.forEach(p => {
        p.remainTBurst = p.tBurst;
        p.isRunning = false;
        p.latency = 0;
    });

    tableEl.replaceChild(newTBodyEl, oldTBodyEl);

    document.getElementById("idTime").innerHTML = "";

    document.getElementById("efficiencyCell").innerHTML = "0";
    document.getElementById("waitingTimeCell").innerHTML = "0";
    document.getElementById("turnaroundTimeCell").innerHTML = "0";
}

function start() {
    t = 0;
    currentProcess = null;
    document.getElementById("idTime").innerHTML = "Tempo: " + t;

    let tableEl = document.getElementById("idTable");
    let oldTBodyEl = tableEl.getElementsByTagName('tbody')[0];
    let newTBodyEl = document.createElement('tbody');

    process.forEach(p => {
        p.remainTBurst = p.tBurst;
        p.isRunning = false;
        p.latency = 0;
    });

    for (let i = 0; i < process.length; i++) {
        let trEl = newTBodyEl.insertRow();
        let tdEl = trEl.insertCell();
        tdEl.appendChild(document.createTextNode(process[i].nome));
        tdEl = trEl.insertCell();
        tdEl.appendChild(document.createTextNode(process[i].tArrivo));
        tdEl = trEl.insertCell();
        tdEl.appendChild(document.createTextNode(process[i].tBurst));
        tdEl = trEl.insertCell();
        tdEl.appendChild(document.createTextNode(process[i].remainTBurst));
        tdEl.id = "idP" + i;        
        tdEl = trEl.insertCell();
        tdEl.id = "stateP" + i;
        tdEl.appendChild(document.createTextNode(process[i].getState()));
    }

    tableEl.replaceChild(newTBodyEl, oldTBodyEl);

    // Resetta la tabella delle statistiche a 0
    document.getElementById("efficiencyCell").innerHTML = "0";
    document.getElementById("waitingTimeCell").innerHTML = "0";
    document.getElementById("turnaroundTimeCell").innerHTML = "0";
}

function step() {
    // Esegui il calcolo FCFS solo al tempo t, solo se t è minore di maxTime
    fcfs();
    t++;
    document.getElementById("idTime").innerHTML = "Tempo: " + t;

    // Controlla se tutti i processi sono completati
    let allProcessesTerminated = true;
    for (let i = 0; i < process.length; i++) {
        if (process[i].remainTBurst !== 0) {
            allProcessesTerminated = false;
            break;
        }
    }

    // Calcola le statistiche solo quando tutti i processi sono terminati
    if (allProcessesTerminated) {
        stats();
    }
}

function stats() {
    let totalBurstTime = 0; 
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;

    let currentTime = t; 
    let minTime = Infinity;

    for (let i = 0; i < process.length; i++) {
        if (process[i].tArrivo < minTime) {
            minTime = process[i].tArrivo;
        }
    }

    for (let i = 0; i < process.length; i++) {
        totalBurstTime += process[i].tBurst; 

        // Calcolo del tempo di turnaround
        let turnaroundTime = Math.max(0, currentTime - process[i].tArrivo);

        // Calcolo del tempo di attesa
        let waitingTime = turnaroundTime - process[i].tBurst;
        if (waitingTime < 0) waitingTime = 0;

        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
    }

    // Calcolo efficienza
    let efficiency = ((totalBurstTime + minTime) / currentTime) * 100;

    // Calcolo dei tempi medi
    let mediumWaitingTime = totalWaitingTime / process.length;
    let mediumTurnaroundTime = totalTurnaroundTime / process.length;

    // Aggiorna i dati nella tabella
    document.getElementById("efficiencyCell").innerHTML = efficiency.toFixed(2);
    document.getElementById("waitingTimeCell").innerHTML = mediumWaitingTime.toFixed(2);
    document.getElementById("turnaroundTimeCell").innerHTML = mediumTurnaroundTime.toFixed(2);

    console.log("Efficienza:", efficiency.toFixed(2) + "%");
    console.log("Tempo medio di attesa:", mediumWaitingTime.toFixed(2));
    console.log("Tempo medio di turnaround:", mediumTurnaroundTime.toFixed(2));
}

function fcfs() {
    // Se non c'è un processo attuale, trova il prossimo disponibile
    if (currentProcess === null || currentProcess.remainTBurst === 0) {
        currentProcess = null;
    
        for (let i = 0; i < process.length; i++) {
            if (process[i].canRun() && (currentProcess === null || process[i].tArrivo < currentProcess.tArrivo)) {
                currentProcess = process[i];
            }
        }
    }

    // Se abbiamo un processo in esecuzione, esegui un burst
    if (currentProcess !== null && currentProcess.canRun()) {
        currentProcess.isRunning = true;
        currentProcess.remainTBurst = Math.max(0, currentProcess.remainTBurst - 1);
        document.getElementById("idP" + process.indexOf(currentProcess)).innerHTML = currentProcess.remainTBurst;
    }

    // Aggiorna lo stato di tutti i processi
    for (let i = 0; i < process.length; i++) {
        if (process[i] === currentProcess && process[i].remainTBurst > 0) {
            process[i].isRunning = true;
        } 
        else {
            process[i].isRunning = false;
        }
        document.getElementById("stateP" + i).innerHTML = process[i].getState();
    }
}