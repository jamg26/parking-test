
import prompts from 'prompts'
import ParkingClass from './parkingClass'

const parking = new ParkingClass();


function prompt() {
    (async () => {

        const onCancel = () => {
            process.exit(1);
        }

        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick an action',
            choices: [
                { title: 'Get Parking Slots', description: 'Return the parking slots map.', value: 'GET_PARKING_SLOTS' },
                { title: 'Park A Car', value: 'PARK_CAR' },
                { title: 'Unpark A Car', value: 'UNPARK_CAR' },
            ],
        }, { onCancel: onCancel });

        switch(response.value) {
            case 'GET_PARKING_SLOTS':
                console.log(parking.getParkingSlots().map((slot) => console.log(slot)))
                break;
            case 'PARK_CAR':
                const parkReponse = await prompts({
                    type: 'select',
                    name: 'value',
                    message: 'Select Car Size',
                    choices: [
                        { title: 'Small', description: 'Rate: 40 + 20.00/hour.', value: 'SP' },
                        { title: 'Medium', description: 'Rate: 40 + 60.00/hour.', value: 'MP' },
                        { title: 'Large', description: 'Rate: 40 + 100.00/hour.', value: 'LP' },
                        { title: 'Cancel', value: 'CANCEL' }
                    ],
                }, { onCancel: onCancel });

                if(parkReponse.value === 'CANCEL') {
                    prompt()
                    return
                }


                const generatedCar = { id: Math.floor(Math.random() * 1000000), size: parkReponse.value };
                
                const carSize = parkReponse.value;

                switch(parkReponse.value) {
                    case 'SP':
                        parking.parkCar(generatedCar, parking.getParkingSlots()[carSize === 'SP' ? 0 : carSize === 'MP' ? 1 : 2])
                        break;
                    case 'MP':
                        parking.parkCar(generatedCar, parking.getParkingSlots()[carSize === 'SP' ? 0 : carSize === 'MP' ? 1 : 2])
                        break;
                    case 'LP':
                        parking.parkCar(generatedCar, parking.getParkingSlots()[carSize === 'SP' ? 0 : carSize === 'MP' ? 1 : 2])
                        break;
                    default:
                        break
                }
                break;
            
            case 'UNPARK_CAR':
                const cars = parking.getParkingSlots().flat().filter(slot => slot.isAvailable === false);
                const unparkResponse = await prompts({
                    type: 'select',
                    name: 'value',
                    message: 'Select Car To Unpark',
                    choices: [...cars.map(c => {
                        return { title: `${c.car.id} (${c.car.size}) (${(parking.getVirtualTime() - c.car.parkTime) / 60 / 60}) hours`, value: c.car.id,  description: `PARKED IN: ${c.parkSize}, SLOT: (${c.row}, ${c.column})`, }
                    }), { title: 'Cancel', value: 'CANCEL' }],
                }, { onCancel: onCancel });

                if(unparkResponse.value === 'CANCEL') {
                    prompt()
                    return;
                }
                
                const carToUnpark = cars.find(c => c.car.id === unparkResponse.value);

                parking.unparkCar(carToUnpark)
                
                break;
            default:
                console.log('Invalid option');
                break;
        }

        prompt()
    })();
}


prompt()
