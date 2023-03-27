import './style.css';
import React, { useState } from 'react';
import { Button, Input, Spacing, Loading, Notify } from '../../components';
import { useAuth, useUser } from '../../hooks';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

export function LoginOrRegistrate() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { authorize } = useAuth();
  const { createUser } = useUser();

  const fullname = React.createRef<HTMLInputElement>();
  const email = React.createRef<HTMLInputElement>();
  const password = React.createRef<HTMLInputElement>();
  const reEnterPassword = React.createRef<HTMLInputElement>();
  const DURATION = 500;

  function signin() {
    setIsLoading(true);
    const account = {
      email: `${email.current?.value}`,
      // password: `${password.current?.value}`
    };
    authorize(account)
      .then(() =>
        setTimeout(() => {
          setIsLoading(false);
          navigate('/chat');
          setIsSuccess(!isSuccess);
        }, DURATION),
      )
      .catch((err) => {
        setIsError(!isError);
        setErrorMessage(`${err}`);
      });
  }
  const debounceLogin = debounce(signin, DURATION);

  function signup() {
    if (fullname.current?.value.length === 0) return;
    if (email.current?.value.length === 0) return;
    if (password.current?.value.length === 0) return;
    if (
      `${reEnterPassword.current?.value}`.includes(`${password.current?.value}`)
    )
      return;

    const account = {
      fullname: `${fullname.current?.value}`,
      email: `${email.current?.value}`,
      password: `${password.current?.value}`,
    };
    console.log(account);
    createUser(account)
      .then(() => setIsSignUp(false))
      .catch((err) => console.log(err));
  }
  const debounceRegistrate = debounce(signup, DURATION);

  return (
    <div className='login-bg'>
      <div className='login'>
        {isSuccess && (
          <Notify.Success
            message='Authenticated successfully!'
            duration={3000}
          />
        )}
        {isError && (
          <Notify.Error
            message={errorMessage}
            duration={3000}
          />
        )}
        {isLoading ? (
          <Loading.Swap />
        ) : (
          <React.Fragment>
            <Spacing.Vertical>
              <h2>{isSignUp ? 'SIGN UP' : 'SIGN IN'}</h2>
              {isSignUp && (
                <Input.Text
                  ref={fullname}
                  name='fullname'
                  label='Fullname'
                  onEnter={debounceRegistrate}
                />
              )}
              <Input.Text
                ref={email}
                name='email'
                label='Email'
                onEnter={() =>
                  isSignUp ? debounceRegistrate() : debounceLogin()
                }
              />
              {isSignUp && (
                <React.Fragment>
                  <Input.Password
                    ref={password}
                    name='password'
                    label='Password'
                    onEnter={debounceRegistrate}
                  />
                  <Input.Password
                    ref={password}
                    name='re-enter-password'
                    label='Re-enter Password'
                    onEnter={debounceRegistrate}
                  />
                </React.Fragment>
              )}
            </Spacing.Vertical>
            <Spacing.Vertical>
              {isSignUp ? (
                <Button.Send
                  label='Registrate'
                  onSend={debounceRegistrate}
                />
              ) : (
                <Button.Send
                  label='Log in'
                  onSend={debounceLogin}
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
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
