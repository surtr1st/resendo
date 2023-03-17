import './style.css';
import React, { useState } from 'react';
import { Button, Input, Spacing, Notify } from '../../components';
import { useAuth, useUser } from '../../services';

export function LoginOrRegistrate() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { authorize } = useAuth();
  const { createUser } = useUser();
  const fullname = React.createRef<HTMLInputElement>();
  const email = React.createRef<HTMLInputElement>();
  const password = React.createRef<HTMLInputElement>();
  const reEnterPassword = React.createRef<HTMLInputElement>();

  function signin() {
    const account = {
      email: `${email.current?.value}`,
      // password: `${password.current?.value}`
    };

    authorize(account)
      .then(() => setTimeout(() => location.reload(), 1000))
      .catch((err) => console.log(err));
  }

  function signup() {
    if (fullname.current?.value.length === 0) return;
    if (email.current?.value.length === 0) return;
    if (password.current?.value.length === 0) return;
    if (`${reEnterPassword.current?.value}`.includes(`${password.current?.value}`)) return;

    const account = {
      fullname: `${fullname.current?.value}`,
      email: `${email.current?.value}`,
      password: `${password.current?.value}`,
    };
    createUser(account)
      .then(() => setIsSignUp(false))
      .catch((err) => console.log(err));
  }

  return (
    <div className='login-bg'>
      <div className='login'>
        <Spacing.Vertical>
          <h2>{isSignUp ? 'SIGN UP' : 'SIGN IN'}</h2>
          {isSignUp && (
            <Input.Text
              ref={fullname}
              name='fullname'
              label='Fullname'
              onEnter={() => signup()}
            />
          )}
          <Input.Text
            ref={email}
            name='email'
            label='Email'
            onEnter={() => (isSignUp ? signup() : signin())}
          />
          {isSignUp && (
            <React.Fragment>
              <Input.Password
                ref={password}
                name='password'
                label='Password'
                onEnter={() => signup()}
              />
              <Input.Password
                ref={password}
                name='re-enter-password'
                label='Re-enter Password'
                onEnter={() => signup()}
              />
            </React.Fragment>
          )}
        </Spacing.Vertical>
        <Spacing.Vertical>
          {isSignUp ? (
            <Button.Send
              label='Registrate'
              onSend={signup}
            />
          ) : (
            <Button.Send
              label='Log in'
              onSend={signin}
            />
          )}
          <Button.Link
            label={
              isSignUp
                ? 'Already have an account? Sign in here!'
                : "Doesn't have an account? Sign up here!"
            }
            onNavigate={() => setIsSignUp(!isSignUp)}
          />
        </Spacing.Vertical>
      </div>
    </div>
  );
}
