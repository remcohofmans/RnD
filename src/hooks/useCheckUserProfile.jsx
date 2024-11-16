import { useNavigate } from 'react-router-dom';

const useCheckUserProfile = (user) => {
  const navigate = useNavigate();

  const checkUserProfile = () => {
    if (user) {
      const birthday = user.birthday;
      const name = user.name;
      const hobbies= user.hobbies;
      console.log(birthday, name);
      if (!birthday || !name) {
        // navigate('/profile');
      }
      if (!hobbies){
        // navigate('/userFilterForm');
      }
    }
  };

  return { checkUserProfile };
};

export default useCheckUserProfile;