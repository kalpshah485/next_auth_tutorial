import { useState, useRef } from 'react';
import classes from './auth-form.module.css';
import createUser from '../../assets/createUser';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

function AuthForm() {

  const nameInputRef = useRef();
  const phoneInputRef = useRef();
  const emailInputRef = useRef();
  const passInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const name = nameInputRef.current?.value;
    const email = emailInputRef.current.value;
    const phone = phoneInputRef.current?.value;
    const pass = passInputRef.current.value;
    const userData = phone ? {
      name, email, phone, password: pass
    } : {
      name,
      email,
      password: pass
    }

    if (isLogin) {

      const result = await signIn('credentials', {
        redirect: false,
        email: emailInputRef.current.value,
        password: passInputRef.current.value
      })

      if(!result.error){
        router.replace('/profile');
      } else {
        alert(result.error);
      }

    } else {
      try {
        const result = await createUser(userData);
        if(result.success){
          setIsLogin(true);
        }
      } catch (error) {
        alert(error.message);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        {isLogin ? null :
          <>
            <div className={classes.control}>
              <label htmlFor='name'>Your Name</label>
              <input type='text' id='name' ref={nameInputRef} required />
            </div>
            <div className={classes.control}>
              <label htmlFor='phone'>Your Phone</label>
              <input type='text' id='phone' ref={phoneInputRef} />
            </div>
          </>
        }
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passInputRef} required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
