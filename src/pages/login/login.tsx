import { FC, SyntheticEvent } from 'react';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, setValues } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!values.email || !values.password) return;

    dispatch(loginUser(values)).then((result) => {
      if (result.type === 'user/login/fulfilled') {
        navigate('/');
      }
    });
  };

  return (
    <LoginUI
      errorText=''
      email={values.email}
      setEmail={(email) => setValues({ ...values, email })}
      password={values.password}
      setPassword={(password) => setValues({ ...values, password })}
      handleSubmit={handleSubmit}
    />
  );
};
