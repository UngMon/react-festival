import { useNavigate } from "react-router-dom";
import './Logo.css';

const LogoComponent = () => {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate('/');
  }

  return (
    <div onClick={clickHandler} className='Logo'>
      축제모아
    </div>
  );
};

export default LogoComponent;
