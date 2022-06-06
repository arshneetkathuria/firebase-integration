import { Routes, Route } from 'react-router-dom';
import Login from '../Pages/Login';
import SignUp from '../Pages/SignUp';
import AddField from '../Pages/AddField';
import GoogleMap  from './GoogleMap';

function Pages() {
    return (
        <Routes>
            <Route path={"/"} element={<Login/>}/>
            <Route path={"/SignUp"} element={<SignUp/>}/>
            <Route path={"/firebase/:field"} element={<AddField/>}/>
            <Route path={"/google-maps/:maps"} element={<GoogleMap/>}/>
        </Routes>
    );
}

export default Pages;