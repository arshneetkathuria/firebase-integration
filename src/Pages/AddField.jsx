import app from '../fire';
import { useEffect, useState } from 'react';
import { useNavigate,Link,useLocation} from "react-router-dom";
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth'; 
import CityService from '../Services/CityServices';
import { MdDelete } from 'react-icons/md';
import { GrDocumentUpdate } from 'react-icons/gr';
import { t } from 'i18next';

function AddField() { 
    const initiValues = { c_id: "", name: "", date: "" };
    const initialLocation = { latitude: "", longitude: "" };
    const [cities, setCities] = useState({});
    const [location, setLocation]=useState({});
    const [allCities, setAllCities] = useState([]);
    const [dataAdded, setDataAdded] = useState({});
    const navigate = useNavigate();
    const auth = getAuth(app);
    const  userId  = useLocation();
    const _cityService = new CityService(userId.state);
    
    const handleChange = (field)=>async(e)=>
    {
        e.preventDefault();
        if (field == 'longitude' || field == 'latitude') {
            setLocation({ ...location, [field]: await e.target.value });
            setCities({ ...cities, location: location });  

         }
        else {
            setCities({ ...cities, [field]: await e.target.value });
        }
    }



    const clearInputs = () => {
        setCities(initiValues);
        setLocation(initialLocation);
    }



    const signOutPage = async () => {
     await signOut(auth).then(value=>navigate("/"));
        
    }



    const addToFirebase = async() => {
        setDataAdded(false);
             new CityService().addCity(cities,userId.state).then(value => {
                setDataAdded(true);
                clearInputs();
            });
       
    }




    const getAllData = async () => {
        await _cityService.getAllCities(userId.state).then((doc) => {
            if (doc.data()!= 'undefined') { }
            else {
                setAllCities(doc.data().places);
            }
       });  
    }

    

    const deleteEntry = async (city) =>
    {
        setDataAdded(false);
        await _cityService.deleteCity(userId.state,city).then(value => { setDataAdded(true) });
    }

    
    const valueUparDalo = (city) =>
    {
        setDataAdded(false);
        setCities(city);
        setLocation(city.location);
    }



    const updateEntry = async () => {
        setDataAdded(false);
        await _cityService.updateCity(userId.state, cities).then(value => {
            clearInputs();
            setDataAdded(true)
        });
    }

    const getParticular = async () => {
        await new CityService().getCity(userId.state).then(doc => {
            if (typeof doc.data() !== 'undefined' && doc.data()) {
                setAllCities(doc.data().places);
            }
        });

    }


    useEffect(() => {
        getParticular();
     }, [dataAdded]);


    
    return (
        <div className='firebase-table'>
        <div className='navbar'><span onClick={signOutPage}>{t('logout') }</span></div>
        <div className='fields' >
        <div className='dbba'> <label>{t('id') }</label>
        <input type="text" onChange={handleChange("c_id")} value={cities.c_id}></input></div>
        <div className='dbba'> <label>{t('name') }</label>
        <input type="text" onChange={handleChange("name")} value={cities.name}></input></div>
            <div className='dbba'> <label>{t('latitude') }</label>
            <input type="number" onChange={handleChange("latitude") } value={location.latitude}></input></div>
            <div className='dbba'> <label>{t('longitude') }</label>
            <input type="number" onChange={handleChange("longitude")} value={location.longitude}></input></div>
            <div className='dbba'> <label>{t('date') }</label>
            <input type="date" onChange={handleChange("date")} value={cities.date}></input></div>
        <button onClick={addToFirebase}>{t('addFirebase') }</button>
                {allCities.length > 0 ? <button onClick={updateEntry}>{t('update') }</button>:<></>}
        <table>
            <tr>
                        <th>{t('id') }</th>
                <th>{t('name') }</th>
                <th>{t('location') }</th>
                    <th>{t('date') }</th>
                    <th>{t('options') }</th>
                    <th></th>
                </tr>
                    {allCities.map(city => {
                    return (
                        <tr key={city.c_id} >
                            <td>{city.c_id}</td>
                            <td>{city.name}</td>
                           <Link to="/google-maps/maps" state={{lat:city.location.latitude,lng:city.location.longitude}}> <td>[{city.location.latitude} , {city.location.longitude}]</td></Link>
                            <td>{city.date}</td>
                            <td className='operations'><MdDelete className='trash' onClick={() => deleteEntry(city)} /> / <GrDocumentUpdate className='update' onClick={()=>valueUparDalo(city)}/></td>
            </tr>
                    );
                })}
            
            </table>
            </div>
    </div>);
}

export default AddField;