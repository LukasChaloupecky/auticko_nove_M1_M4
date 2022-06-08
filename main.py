rychlost_vetsi = 250    #pro usnadnění
rychlost_mensi = 45    #pro usnadnění
rychlost_otaceni = 250  #pro usnadnění

automaticke_ovladani = True #False při ovládání ovladačem


barvaLinie = 1 #funguje tak cerna i bila paska
barvaOkoli = 0 #funguje tak cerna i bila paska


OdbockaL = False #u odbocky vleva
OdbockaP = False #u odbocky vprava

first = True #dulezita hloupost k otaceni na druhou stranu
Turnaround = False #variable pro příkaz pro otoceni

TurnBackL = False #otaceni dozadu vlevo
TurnBackR = True  #otaceni dozadu vpravo


pins.set_pull(DigitalPin.P0, PinPullMode.PULL_UP) #nevim
pins.set_pull(DigitalPin.P1, PinPullMode.PULL_UP)#nevim
led.enable(False) #nevim

######################################################################xx

def on_button_pressed_a():
    global OdbockaP, OdbockaL
    if OdbockaL == True:
        OdbockaL = False
    else:
        OdbockaL = True
        odbockaP = False
    if OdbockaP == True:
        if OdbockaP == True:
            OdbockaP = False
        else:
            OdbockaL = False
            OdbockaP = True
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_received_string(receivedString):
    global OdbockaL, OdbockaP, Turnaround, TurnBackL, TurnBackR, barvaLinie, barvaOkoli, automaticke_ovladani
    if receivedString == "KontrolaNadVozítkemPřesOvladač":
        if automaticke_ovladani:
            automaticke_ovladani = False
        else:
            automaticke_ovladani = True
    if receivedString == "ProhodBarvy":
        L = barvaLinie
        O = barvaOkoli
        barvaLinie = O
        barvaOkoli = L
    if receivedString == "OdbockaL":
        if OdbockaL == True:
            OdbockaL = False
        else:
            OdbockaL = True
            odbockaP = False

    if receivedString == "OdbockaP":
        if OdbockaP == True:
            OdbockaP = False
        else:
            OdbockaL = False
            OdbockaP = True
    if receivedString == "Otocka":
        if Turnaround == True:
            Turnaround = False
        else:
            Turnaround = True
    if receivedString == "TurnBackL":
        TurnBackL = True
        TurnBackR = False
    if receivedString == "TurnBackR":
        TurnBackL = False
        TurnBackR = True
#M4
radio.on_received_string(on_received_string)


######################################################################xx



def turnbackR():  #funkce umožnující otočku vzadu vpravo
    magicbit.motor_run(magicbit.Motors.M4, 250)
    magicbit.motor_run(magicbit.Motors.M1, -250)
    basic.pause(2000)








######################################################################xx

def turnright(): #klasické vprava
    magicbit.motor_run(magicbit.Motors.M4, rychlost_mensi)
    magicbit.motor_run(magicbit.Motors.M1, rychlost_vetsi)
def stop(): #funkce stop
    magicbit.motor_run(magicbit.Motors.M4, 0)
    magicbit.motor_run(magicbit.Motors.M1, 0)
def forward(): #klasické vpřed
    magicbit.motor_run(magicbit.Motors.M4, rychlost_vetsi)
    magicbit.motor_run(magicbit.Motors.M1, rychlost_vetsi)
def turnleft(): #klasické vlevo
    magicbit.motor_run(magicbit.Motors.M4, rychlost_vetsi)
    magicbit.motor_run(magicbit.Motors.M1, rychlost_mensi)
def backward(): #klasické vzad-MOŽNÁ NEFUNGUJE-negativní rychlost
    magicbit.motor_run(magicbit.Motors.M4, -1*rychlost_mensi)
    magicbit.motor_run(magicbit.Motors.M1, -1*rychlost_vetsi)

######################################################################xx

#      AUTOMATICKÉ OVLÁDÁNÍ
def on_forever():
    radio.set_group(77) #radio group
    if automaticke_ovladani:
        ##################################
        if Turnaround:
            turnbackR()  #funkce pro otoceni vzadu (L/P)
            
        ##################################

                    # funkce pro odpocku u krizovatky (L/P)
        elif OdbockaL:
            if sensors.sensor_infraredTracking(DigitalPin.P0) and sensors.sensor_infraredTracking(DigitalPin.P1):
                turnleft()
            elif not sensors.sensor_infraredTracking(DigitalPin.P0) and sensors.sensor_infraredTracking(DigitalPin.P1):
                forward()
            elif not sensors.sensor_infraredTracking(DigitalPin.P0) and not sensors.sensor_infraredTracking(DigitalPin.P1):
                backward()
            elif sensors.sensor_infraredTracking(DigitalPin.P0) and not sensors.sensor_infraredTracking(DigitalPin.P1):
                turnleft()
        elif OdbockaP:
            if sensors.sensor_infraredTracking(DigitalPin.P0) and sensors.sensor_infraredTracking(DigitalPin.P1):
                turnright()
            elif not sensors.sensor_infraredTracking(DigitalPin.P0) and sensors.sensor_infraredTracking(DigitalPin.P1):
                turnright()
            elif not sensors.sensor_infraredTracking(DigitalPin.P0) and not sensors.sensor_infraredTracking(DigitalPin.P1):
                backward()
            elif sensors.sensor_infraredTracking(DigitalPin.P0) and not sensors.sensor_infraredTracking(DigitalPin.P1):
                forward()
        ###############################
        # NORMÁLNÍ AUTOMATICKÁ JÍZDA
        elif sensors.sensor_infraredTracking(DigitalPin.P0) and sensors.sensor_infraredTracking(DigitalPin.P1):
            forward()
        elif not sensors.sensor_infraredTracking(DigitalPin.P0) and not sensors.sensor_infraredTracking(DigitalPin.P1):
            backward()
        elif not sensors.sensor_infraredTracking(DigitalPin.P0) and sensors.sensor_infraredTracking(DigitalPin.P1):
            turnright()
        elif sensors.sensor_infraredTracking(DigitalPin.P0) and not sensors.sensor_infraredTracking(DigitalPin.P1):
            turnleft()
basic.forever(on_forever)

#######################################################################
#       OVLÁDÁNÍ PŘES OVLADAČ
def on_received_number(receivedNumber):
    if automaticke_ovladani == False:
        if receivedNumber == 1: #dopředu
            forward()
        if receivedNumber == 2: #doleva
            turnleft()
        if receivedNumber == 3: #doprava
            turnright()
        if receivedNumber == 4: #dozadu
            backward()
    radio.on_received_number(on_received_number)