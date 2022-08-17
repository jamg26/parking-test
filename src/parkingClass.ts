interface Car {
    id: number;
    size: string;
    parkTime?: number;
}

interface ParkingSlot {
    id: number;
    size: string;
    isAvailable: boolean;
    row: number;
    column: number;
    car: Car
}


export default class Parking {
    SP = 3;
    MP = 2;
    LP = 1;
    parkingSlots = [];
    virtualTime = 0

    // 60 - minute
    // 3600 - 1 sec = 1 hour
    // 3600 * 24 = 1 sec - 1 day
    virtualTimeMultiplier = 3600; 

    parkingEntrance = [[0,0], [1,0], [2,0]]

    constructor() {
        this.parkingSlots = this.initializeParkingSlots();
        this.runVirtualTimer()
    }

    runVirtualTimer() {
        setInterval(() => {
            this.virtualTime += 1 * this.virtualTimeMultiplier;
        }, 1000)
    }

    getVirtualTime() {
        return this.virtualTime;
    }


    getParkingSlots() {
        return this.parkingSlots;
    }


    initializeParkingSlots() {
        let parkingSlots = [];
        let parkRowSP = [];
        let parkRowMP = [];
        let parkRowLP = [];

        for (let i = 0; i < this.SP; i++) {
            parkRowSP.push({ row: 0, column: i, isAvailable: true, parkSize: 'SP', ratePerHour: 20 });
        }

        for (let i = 0; i < this.MP; i++) {
            parkRowMP.push({ row: 1, column: i, isAvailable: true, parkSize: 'MP', ratePerHour: 60 });
        }

        for (let i = 0; i < this.LP; i++) {
            parkRowLP.push({ row: 2, column: i, isAvailable: true, parkSize: 'LP', ratePerHour: 100 });
        }

        parkingSlots.push(parkRowSP);
        parkingSlots.push(parkRowMP);
        parkingSlots.push(parkRowLP);

        return parkingSlots;
    }


    parkCar(car: Car, parkRow: ParkingSlot[]) {
        let parkingSlots = this.parkingSlots;
        let parkSlot = parkRow.find((slot: ParkingSlot) => slot.isAvailable === true);
        if (parkSlot) {
            parkSlot.isAvailable = false;
            parkSlot.car = car;
            parkSlot.car.parkTime = this.virtualTime
            console.log("\x1b[32m", 'Car Parked Successfully');
            return true;
        } else {
            if(car.size === 'S') { 
                const hasMPAvailable = parkingSlots[1].some((slot: ParkingSlot) => slot.isAvailable === true);
                const hasLPAvailable = parkingSlots[2].some((slot: ParkingSlot) => slot.isAvailable === true);

                if(hasMPAvailable) {
                    this.parkCar(car, parkingSlots[1])
                    return true
                }

                if(hasLPAvailable) {
                    this.parkCar(car, parkingSlots[2])
                    return true
                }
            }

            if(car.size === 'M') {
                const hasLPAvailable = parkingSlots[2].some((slot: ParkingSlot) => slot.isAvailable === true);

                if(hasLPAvailable) {
                    this.parkCar(car, parkingSlots[2])
                    return true
                }
            }

            
            console.log("\x1b[31m", 'No Parking Slots Available');
            return false;
        }
    }

    unparkCar(car: { car: Car }) {
        let parkingSlots = this.parkingSlots;
        let parkSlot = parkingSlots.flat().find((slot: ParkingSlot) => slot.car?.id === car.car.id);
        if (parkSlot) {
            this.calculateParkingFee(parkSlot)
            parkSlot.isAvailable = true;
            parkSlot.car = null;
            delete parkSlot.car
            console.log("\x1b[32m", 'Car Unparked Successfully');
            return true;
        } else {
            console.log("\x1b[31m", 'Car not found');
            return false;
        }
    }

    calculateParkingFee(parkSlot) {
        const parkTime = this.virtualTime - parkSlot.car.parkTime;
        const parkHours = Math.round((parkTime / 60) / 60)
        let parkFee = 0
        if(parkHours >= 24) {
            parkFee = 5000 + 40 + ((parkHours - 24) * parkSlot.ratePerHour)
        } else {
            parkFee = 40 + (parkHours * parkSlot.ratePerHour)
        }
        console.log("\x1b[36m", 'Park Time (hours):', parkHours)
        console.log("\x1b[36m", 'Park Fee:', parkFee.toFixed(2))
    }


}