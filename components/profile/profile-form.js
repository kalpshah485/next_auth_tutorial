import { useRef } from 'react';
import classes from './profile-form.module.css';

function ProfileForm() {
  const oldPassRef = useRef();
  const newPassRef = useRef();
  const handleChangePassword = async (event) => {
    event.preventDefault();
    const res = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify({
        oldPassword: oldPassRef.current.value,
        newPassword: newPassRef.current.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log(data);
  }
  return (
    <form className={classes.form} onSubmit={handleChangePassword}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' ref={newPassRef} id='new-password' />
      </div>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input type='password' ref={oldPassRef} id='old-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
