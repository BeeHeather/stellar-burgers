import { PageUIProps } from '../common-type';

export type RegisterUIProps = PageUIProps & {
  password: string;
  userName: string;
  setPassword: (value: string) => void;
  setUserName: (value: string) => void;
};
