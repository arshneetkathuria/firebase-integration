import { useEffect,useState } from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAuth } from 'firebase/auth';
import app from '../fire';
import CityService from '../Services/CityServices';
import { signInWithEmailAndPassword,onAuthStateChanged} from 'firebase/auth';



function Login() {
    const initialValues = { email: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const [user, setUser] = useState("");
    const navigate = useNavigate();
    const auth = getAuth(app);
    const { t, i18n } = useTranslation();



    const handleLogin = async (e) => {
        e.preventDefault();
        let abc = validate(formValues);
        setFormErrors(abc);
        
        if (abc.email && abc.password) {
            setError("");
        } else {
            await signInWithEmailAndPassword(auth, formValues.email, formValues.password).then(value => {
                if (value) {
                    setUser(value);
                    navigate("/firebase/AddField",{state:value.user.uid});
                }
                else {
                    setUser("");
                }
            }).catch((error) => {
                switch (error.code) {
                    case 'auth/invalid-email':
                        setError("Invalid Email");
                        break;
                    case 'auth/user-disabled':
                        setError("EUser is disabled");
                        break;
                    case 'auth/user-not-found':
                        setError("Email doesn't exist");
                        break;
                    case 'auth/wrong-password':
                        setError("Wrong Password");
                        break;
                }
            });
        }
           
        
    }



    const clearInputs = () => {
        setFormValues(initialValues);
    }


    const clearErrors = () => {
        setFormErrors({});
    }
   
    
    const authListener = () => {
        onAuthStateChanged((auth,user) => {
            if (user) {
                setUser(user);
                clearInputs();
                navigate("/firebase/AddField",{state:user.uid});
            }
            else
                setUser("");
        })
    }



    const handleChange = (e) => {
        const { type, value } = e.target;
        setFormValues({ ...formValues, [type]: value });
    }



    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        (Object.keys(formErrors).length === 0 ? setError("") : setError("error"));
        setIsSubmit(true);
    }

    const handleLanguage = (lang) =>
    {
        console.log('language', lang);
        i18n.changeLanguage(lang);
        
        }



    const validate = (values) => {
        const errors = {};
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!values.email)
            errors.email = "Email is required";
        else if (!regex.test(values.email))
          errors.email = "This is not a valid email";
            
        if (!values.password)
            errors.password = "Password is required";
        else if (values.password.length < 4)
        errors.password = "Password must be more than 4 characters.";

        return errors;
    }



    useEffect(() => {
        // new CityService().getCity(user.uid);
     }, [formErrors,user])

  
    
    return (
        <div>
            <nav>
                <button onClick={()=>handleLanguage('en')}>English</button>
                <button onClick={()=>handleLanguage('hi')}>हिन्दी</button>
                </nav>
        <div className="login">
            {(Object.keys(error).length === 0 ? <div></div> : <div className="unsuccess">{error}</div>)}
            
                <form className="loginContainer" onSubmit={handleSubmit}  >
                    <label>{t('email')}</label>
                    <div className="btnContainer"><input type="email" placeholder={t('email')} className="field" value={formValues.email} onChange={handleChange}></input></div>
                <p className="error">{formErrors.email}</p>    
                    <label>{t('password')}</label>
                    <input type="password" placeholder={t('password')} className="field" value={formValues.password} onChange={handleChange}></input>
                    <p className="error">{formErrors.password}</p>        
               <button onClick={handleLogin}>{t('signIn')} </button>
                    <p className="oneLiner">{t('dontHaveAccount')} <Link to={"/SignUp"}  className="link">{t('signUp')} </Link></p>
                </form>
            </div>
            </div>);
}
export default Login;