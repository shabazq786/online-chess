import React  from 'react'
import Stats from './Stats'
import {useParams} from 'react-router-dom'

const Profile = () => {
  let {username} = useParams();
  return (<Stats username={username} />);
}
 
export default Profile;