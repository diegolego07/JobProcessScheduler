class Process {
    constructor(nome, tArrivo, tBurst) {
        this.nome = nome;
        this.tArrivo = tArrivo;
        this.tBurst = tBurst;
        this.remainTBurst = tBurst;
        this.isRunning = false;

    }

    getState() {
        if (t < this.tArrivo) return "New";
        else if (this.remainTBurst === 0) return "Terminated";
        else if (this.isRunning) return "Running";
        else return "Ready";
    }

    canRun() {
        return (t >= this.tArrivo && this.remainTBurst > 0);
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
    });

    tableEl.replaceChild(newTBodyEl, oldTBodyEl);

    document.getElementById("idTime").innerHTML = "";
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
    });

    for (let i = 0; i < process.length; i++) {
        const trEl = newTBodyEl.insertRow();
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
}

function step() {
    fcfs();
    t++;
    document.getElementById("idTime").innerHTML = "Tempo: " + t;
    stats(); // Calcola e aggiorna i dati ogni passo
}

function stats() {
    let totalBurstTime = 0; // Tempo totale dei burst
    let totalTurnaroundTime = 0; // Tempo totale di turnaround
    let totalWaitingTime = 0; // Tempo totale di attesa

    let currentTime = t; // Tempo corrente del simulatore

    process.forEach(p => {
        totalBurstTime += p.tBurst; // Somma del tempo di burst totale di tutti i processi

        // Calcolo del tempo di turnaround: tempo attuale - tempo di arrivo
        let turnaroundTime = Math.max(0, currentTime - p.tArrivo);

        // Calcolo del tempo di attesa: turnaround - tempo di burst
        let waitingTime = turnaroundTime - p.tBurst;
        if (waitingTime < 0) waitingTime = 0;

        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
    });

    // Tempo massimo per evitare divisione per 0
    const maxTime = Math.max(currentTime, totalBurstTime);

    // Calcolo efficienza come rapporto tra tempo di burst effettivo e tempo totale trascorso
    const efficiency = (totalBurstTime / maxTime) * 100;

    // Calcolo dei tempi medi
    const mediumWaitingTime = totalWaitingTime / process.length;
    const mediumTurnaroundTime = totalTurnaroundTime / process.length;

    // Aggiorna i dati nella tabella
    document.getElementById("efficiencyCell").innerHTML = efficiency.toFixed(2);
    document.getElementById("waitingTimeCell").innerHTML = mediumWaitingTime.toFixed(2);
    document.getElementById("turnaroundTimeCell").innerHTML = mediumTurnaroundTime.toFixed(2);

    // Output su console per debugging
    console.log("Efficienza:", efficiency.toFixed(2) + "%");
    console.log("Tempo medio di attesa:", mediumWaitingTime.toFixed(2));
    console.log("Tempo medio di turnaround:", mediumTurnaroundTime.toFixed(2));
}

function fcfs() {
    // Se non c'è un processo attuale, trova il prossimo disponibile
    if (currentProcess === null || currentProcess.remainTBurst === 0) {
        currentProcess = null;
    
        process.forEach(function(p) {
            if (p.canRun() && (currentProcess === null || p.tArrivo < currentProcess.tArrivo)) {
                currentProcess = p;
            }
        });
    }

    // Se abbiamo un processo in esecuzione, esegui un burst
    if (currentProcess !== null && currentProcess.canRun()) {
        currentProcess.isRunning = true;
        currentProcess.remainTBurst = Math.max(0, currentProcess.remainTBurst - 1);
        document.getElementById("idP" + process.indexOf(currentProcess)).innerHTML = currentProcess.remainTBurst;
    }

    // Aggiorna lo stato di tutti i processi
    process.forEach((p, i) => {
        if (p === currentProcess && p.remainTBurst > 0) {
            p.isRunning = true;
        } else {
            p.isRunning = false;
        }
        document.getElementById("stateP" + i).innerHTML = p.getState();
    });

    for (let p of process) {
        totalBurstTime += p.tBurst;
        totalTurnaroundTime += p.turnaroundTime;
        totalWaitingTime += p.waitingTime;
    }

    const efficiency = (totalBurstTime / t) * 100;
    const avgWaitingTime = totalWaitingTime / process.length;
    const avgTurnaroundTime = totalTurnaroundTime / process.length;

    // Mostra le statistiche nella tabella
    document.getElementById("efficiencyCell").innerHTML = efficiency.toFixed(2);
    document.getElementById("waitingTimeCell").innerHTML = avgWaitingTime.toFixed(2);
    document.getElementById("turnaroundTimeCell").innerHTML = avgTurnaroundTime.toFixed(2);
    document.getElementById("statsTable").style.display = "table";

    console.log("Efficienza:", efficiency.toFixed(2) + "%");
    console.log("Tempo medio di attesa:", avgWaitingTime.toFixed(2));
    console.log("Tempo medio di turnaround:", avgTurnaroundTime.toFixed(2));
}

function fcfs() {
    if (currentProcess === null || currentProcess.remainTBurst === 0) {
        currentProcess = null;

        for (let p of process) {
            if (p.canRun(t) && (currentProcess === null || p.tArrivo < currentProcess.tArrivo)) {
                currentProcess = p;
            }
        }
    }

    if (currentProcess !== null && currentProcess.canRun(t)) {
        currentProcess.isRunning = true;
        currentProcess.remainTBurst = Math.max(0, currentProcess.remainTBurst - 1);
    }

    for (let p of process) {
        p.isRunning = p === currentProcess && p.remainTBurst > 0;
    }
}
