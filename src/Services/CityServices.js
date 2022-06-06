import app from '../fire';
import { getFirestore } from '@firebase/firestore';

import {
collection,
getDoc,
setDoc,
doc
} from 'firebase/firestore';

const db = getFirestore(app);
const cityCollection = collection(db, "cities");
let docRef;
let user;
let places = [];

class CityDataService
{     
 

    addCity = async (newcity, id) => {
        places = [];
        await new CityDataService().getCity(id).then(document => {
            const data = document.data();
            if ( typeof data==='undefined') {
                places.push(newcity);
                setDoc(doc(cityCollection, id), {places:places});
            }
            else {
                const obj = data.places;
                places.push(...obj);
                places.push(newcity);
                setDoc(doc(cityCollection, id), {places:places });
            }
        }).catch(error=>console.log('error in adding',error));;
    };
    

    updateCity = async(userId,city) => {
        places = [];
        let index;
       await new CityDataService().getCity(userId).then(document => {
            const data = document.data();
            if (Object.keys(data).length !== 0) {
                places = data.places;
                for (let i = 0; i < places.length; i++)
        {
                    if (places[i].c_id === city.c_id)
                        index = i;
        }
                if (index > -1) {
                    places.splice(index, 1);
                    places.push(city);
                    setDoc(doc(cityCollection, userId), {places:places });

                }
            }
         }).catch(error=>console.log('error in updating',error));
        return places;
    }
    

    deleteCity = async (userId,city) => {
        places = [];
        let index;
        await new CityDataService().getCity(userId).then(document => {
            const data = document.data();
            if (Object.keys(data).length !== 0) {
                places = data.places;
                for (let i = 0; i < places.length; i++)
        {
                    if (places[i].c_id === city.c_id)
                        index = i;
        }
                if (index > -1) {
                    places.splice(index, 1);
                    setDoc(doc(cityCollection, userId), {places:places });

                }
            }
        }).catch(error=>console.log('error in deleting',error));;
        return places;
    }
    
    
    getAllCities = async (id) => {
        const city = doc(db, "cities", id);
        return getDoc(city);
    };


    getCity = (id) => {
        const city = doc(db, "cities", id);
        // const city = doc(db, "cities", 'YL79cihIrbXIfNewsXEBDILYdDi1');
        return getDoc(city);
    }

}

export default CityDataService;