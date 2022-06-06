import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useTranslation } from "react-i18next";
import app from '../fire';

function SignUp() {
    const initialValues = { email: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [error, setError] = useState("");
    const auth = getAuth(app);
    const { t, i18n } = useTranslation();


    const handleSignUp = (e) => {
        e.preventDefault();
        let abc = validate(formValues);
        setFormErrors(abc);

        console.log(abc.email);
        if (abc.email && abc.password)
        { setError("") }
        else {
            createUserWithEmailAndPassword(auth,formValues.email, formValues.password).then(value => clearInputs()).catch(error => {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setError("Email already in use");
                        break;
                    case 'auth/invalid-email':
                        setError("Invalid email");
                        break;
                    case 'auth/weak-password':
                        setError("Weak password");
                        break;
                }
            });
        }
    }

    const handleChange = (e) => {
        const { type, value } = e.target;
        setFormValues({ ...formValues, [type]: value });
    }


    const validate = (values) => {
        const errors = {};
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!values.email) {
            errors.email = "Email is required";
        }
        else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        else if (values.password.length < 4)
        errors.password = "Password must be more than 4 characters.";
        return errors;
    }

    const clearInputs = () => {
        setFormValues(initialValues);
    }
    const clearErrors = () => {
        setError();
        // setFormErrors({});
    }
    useEffect(() => { }, [formErrors]);

    return (
        <div className="login">
            {(Object.keys(error).length === 0  ? <div></div> : <div className="unsuccess">{error}</div>)}
            <form className="loginContainer" onSubmit={handleSignUp} >
                    <label>{t('email')} </label>
                    <div className="btnContainer"><input type="email" placeholder={t('email')}  className="field" onChange={handleChange} value={formValues.email}></input></div>
                    <p className="error">{formErrors.email}</p>    
    
                <label>{t('password')} </label>
                    <input type="password" placeholder={t('password')}  className="field" onChange={handleChange} value={formValues.password}></input>
                    <p className="error">{formErrors.password}</p>        
    
                <button>{t('signUp')} </button>
                    <p className="oneLiner">{t('alreadyHaveAccount')} <Link to={"/"} className="link">{t('signIn')} </Link></p>
                </form>
            </div>);
}

export default SignUp;