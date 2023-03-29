import './style.css';
import React, { useState } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '../../hooks';
import {
  Button,
  Input,
  Spacing,
  Loading,
  Notify,
  LogInIcon,
} from '../../components';


export function LoginOrRegistrate() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [responseMessage, setResponseMessage] = useState('')

  const navigate = useNavigate();
  const { authorize, setAuthorizing } = useAuth();
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
    };
    (async () => {
      try {
        const response = await authorize(account)
        const data = await response.json()
        if (response.status === 400)
          throw new Error(data.message)
        setAuthorizing(data);
        setResponseMessage('Authorized')
        setIsSuccess(true);
        setTimeout(() => {
          setIsLoading(false);
          navigate('/chat');
        }, DURATION)
      }
      catch (err) {
        setIsError(true);
        setIsLoading(false);
        setResponseMessage(`${err}`)
      }
    })()
  }
  const debounceLogin = debounce(signin, DURATION);

  const removeLastSymbol = (text: string) => text.replace(/.$/, '')

  function convertCamelCaseToNormal(text: string) {
    // Split the string by capital letters and join with a space
    const sequence = text.split(/(?=[A-Z])/).join(' ');
    // Capitalize the first letter
    const firstLetterCapitalized = sequence.charAt(0).toUpperCase() + sequence.slice(1);
    return firstLetterCapitalized;
  }

  function isEmptyProperties() {
    const user: {
      [key: string]: any
    } = {
      fullname: fullname.current?.value,
      email: email.current?.value,
      password: password.current?.value,
      reEnterPassword: reEnterPassword.current?.value,
    }
    let errors = ''
    for (const field in user) {
      if (!user[field] && field !== 'reEnterPassword')
        errors += `${convertCamelCaseToNormal(`${[field]}`)}, `
      if (field === 'reEnterPassword')
        errors += 'Re-enter password, '
    }
    if (errors.length === 0)
      return false
    setResponseMessage(`${removeLastSymbol(errors.trimEnd())} is empty`)
    setIsError(!isError)
    return true
  }

  function signup() {
    if (isEmptyProperties())
      return
    const account = {
      fullname: `${fullname.current?.value} `,
      email: `${email.current?.value} `,
      password: `${password.current?.value} `,
    };
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
            message={responseMessage}
            duration={3000}
            reset={() => setIsSuccess(false)}
          />
        )}
        {isError && (
          <Notify.Error
            message={responseMessage}
            duration={3000}
            reset={() => setIsError(false)}
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
                  icon={<LogInIcon />}
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
