let rychlost_vetsi = 250
// pro usnadnění
let rychlost_mensi = 45
// pro usnadnění
let rychlost_otaceni = 250
// pro usnadnění
let automaticke_ovladani = true
// False při ovládání ovladačem
let barvaLinie = 1
// funguje tak cerna i bila paska
let barvaOkoli = 0
// funguje tak cerna i bila paska
let OdbockaL = false
// u odbocky vleva
let OdbockaP = false
// u odbocky vprava
let first = true
// dulezita hloupost k otaceni na druhou stranu
let Turnaround = false
// variable pro příkaz pro otoceni
let TurnBackL = false
// otaceni dozadu vlevo
let TurnBackR = true
// otaceni dozadu vpravo
pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
// nevim
pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
// nevim
led.enable(false)
// nevim
// #####################################################################xx
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    let odbockaP: boolean;
    
    if (OdbockaL == true) {
        OdbockaL = false
    } else {
        OdbockaL = true
        odbockaP = false
    }
    
    if (OdbockaP == true) {
        if (OdbockaP == true) {
            OdbockaP = false
        } else {
            OdbockaL = false
            OdbockaP = true
        }
        
    }
    
})
// M4
radio.onReceivedString(function on_received_string(receivedString: string) {
    let L: number;
    let O: number;
    let odbockaP: boolean;
    
    if (receivedString == "KontrolaNadVozítkemPřesOvladač") {
        if (automaticke_ovladani) {
            automaticke_ovladani = false
        } else {
            automaticke_ovladani = true
        }
        
    }
    
    if (receivedString == "ProhodBarvy") {
        L = barvaLinie
        O = barvaOkoli
        barvaLinie = O
        barvaOkoli = L
    }
    
    if (receivedString == "OdbockaL") {
        if (OdbockaL == true) {
            OdbockaL = false
        } else {
            OdbockaL = true
            odbockaP = false
        }
        
    }
    
    if (receivedString == "OdbockaP") {
        if (OdbockaP == true) {
            OdbockaP = false
        } else {
            OdbockaL = false
            OdbockaP = true
        }
        
    }
    
    if (receivedString == "Otocka") {
        if (Turnaround == true) {
            Turnaround = false
        } else {
            Turnaround = true
        }
        
    }
    
    if (receivedString == "TurnBackL") {
        TurnBackL = true
        TurnBackR = false
    }
    
    if (receivedString == "TurnBackR") {
        TurnBackL = false
        TurnBackR = true
    }
    
})
// #####################################################################xx
function turnbackR() {
    // funkce umožnující otočku vzadu vpravo
    magicbit.MotorRun(magicbit.Motors.M4, 250)
    magicbit.MotorRun(magicbit.Motors.M1, -250)
    basic.pause(2000)
}

// #####################################################################xx
function turnright() {
    // klasické vprava
    magicbit.MotorRun(magicbit.Motors.M4, rychlost_mensi)
    magicbit.MotorRun(magicbit.Motors.M1, rychlost_vetsi)
}

function stop() {
    // funkce stop
    magicbit.MotorRun(magicbit.Motors.M4, 0)
    magicbit.MotorRun(magicbit.Motors.M1, 0)
}

function forward() {
    // klasické vpřed
    magicbit.MotorRun(magicbit.Motors.M4, rychlost_vetsi)
    magicbit.MotorRun(magicbit.Motors.M1, rychlost_vetsi)
}

function turnleft() {
    // klasické vlevo
    magicbit.MotorRun(magicbit.Motors.M4, rychlost_vetsi)
    magicbit.MotorRun(magicbit.Motors.M1, rychlost_mensi)
}

function backward() {
    // klasické vzad-MOŽNÁ NEFUNGUJE-negativní rychlost
    magicbit.MotorRun(magicbit.Motors.M4, -1 * rychlost_mensi)
    magicbit.MotorRun(magicbit.Motors.M1, -1 * rychlost_vetsi)
}

// #####################################################################xx
//       AUTOMATICKÉ OVLÁDÁNÍ
basic.forever(function on_forever() {
    radio.setGroup(77)
    // radio group
    if (automaticke_ovladani) {
        // #################################
        if (Turnaround) {
            turnbackR()
        } else if (OdbockaL) {
            // funkce pro otoceni vzadu (L/P)
            // #################################
            //  funkce pro odpocku u krizovatky (L/P)
            if (sensors.sensor_infraredTracking(DigitalPin.P0) && sensors.sensor_infraredTracking(DigitalPin.P1)) {
                turnleft()
            } else if (!sensors.sensor_infraredTracking(DigitalPin.P0) && sensors.sensor_infraredTracking(DigitalPin.P1)) {
                forward()
            } else if (!sensors.sensor_infraredTracking(DigitalPin.P0) && !sensors.sensor_infraredTracking(DigitalPin.P1)) {
                backward()
            } else if (sensors.sensor_infraredTracking(DigitalPin.P0) && !sensors.sensor_infraredTracking(DigitalPin.P1)) {
                turnleft()
            }
            
        } else if (OdbockaP) {
            if (sensors.sensor_infraredTracking(DigitalPin.P0) && sensors.sensor_infraredTracking(DigitalPin.P1)) {
                turnright()
            } else if (!sensors.sensor_infraredTracking(DigitalPin.P0) && sensors.sensor_infraredTracking(DigitalPin.P1)) {
                turnright()
            } else if (!sensors.sensor_infraredTracking(DigitalPin.P0) && !sensors.sensor_infraredTracking(DigitalPin.P1)) {
                backward()
            } else if (sensors.sensor_infraredTracking(DigitalPin.P0) && !sensors.sensor_infraredTracking(DigitalPin.P1)) {
                forward()
            }
            
        } else if (sensors.sensor_infraredTracking(DigitalPin.P0) && sensors.sensor_infraredTracking(DigitalPin.P1)) {
            // ##############################
            //  NORMÁLNÍ AUTOMATICKÁ JÍZDA
            forward()
        } else if (!sensors.sensor_infraredTracking(DigitalPin.P0) && !sensors.sensor_infraredTracking(DigitalPin.P1)) {
            backward()
        } else if (!sensors.sensor_infraredTracking(DigitalPin.P0) && sensors.sensor_infraredTracking(DigitalPin.P1)) {
            turnright()
        } else if (sensors.sensor_infraredTracking(DigitalPin.P0) && !sensors.sensor_infraredTracking(DigitalPin.P1)) {
            turnleft()
        }
        
    }
    
})
// ######################################################################
//        OVLÁDÁNÍ PŘES OVLADAČ
