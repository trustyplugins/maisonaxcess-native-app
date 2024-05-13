import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    password: Yup.string().required('Password is required'),
  });
  export default validationSchema; 