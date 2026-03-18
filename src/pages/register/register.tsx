import { FC, SyntheticEvent } from 'react';
import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, setValues } = useForm({
    userName: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!values.userName || !values.email || !values.password) return;

    dispatch(
      registerUser({
        name: values.userName,
        email: values.email,
        password: values.password
      })
    ).then((result) => {
      if (result.type === 'user/register/fulfilled') {
        navigate('/');
      }
    });
  };

  return (
    <RegisterUI
      errorText=''
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={(email) => setValues({ ...values, email })}
      setPassword={(password) => setValues({ ...values, password })}
      setUserName={(userName) => setValues({ ...values, userName })}
      handleSubmit={handleSubmit}
    />
  );
};
