import {BrowserRouter,Route, Switch} from 'react-router-dom'

import ProtectedRoute  from './components/ProtectedRoute'

import LoginForm from './components/LoginForm/LoginForm.js'
import RegisterForm from './components/RegisterForm/Register.js'
import Home from './components/Home/Home.js'
import ChatRequests from './components/ChatRequests/ChatRequests.js';


import MyProfile from './components/MyProfile/MyProfile.js';
import MyContacts from './components/MyContacts/MyContacts.js';
import MyShortlists from './components/MyShortlists/MyShortlists.js';
import Enquiries from './components/Enquiries/Enquiries.js'
import MyProperties from './components/MyProperties/MyProperties.js'
import MyPayments from './components/MyPayments/MyPayments.js'
import PropertiesPage from './components/PropertiesPage/PropertiesPage.js'
import AddProperty from './components/AddProperty/AddProperty.js'
import ViewDetails from './components/ViewDetails/ViewDetails.js'


import Cookie from 'js-cookie'
import './App.css';



const App = () => { 
  const token=Cookie.get('jwt_token')
  console.log(token===undefined)
  return(
  <>
  
  <BrowserRouter>
    <Switch>
        <Route exact path="/login" component={LoginForm} />
        <Route exact path="/register" component={RegisterForm} />
      
        <Route exact path="/" component={Home} />
        <ProtectedRoute exact path='/chat-requests' component={ChatRequests}/>

        <ProtectedRoute exact path='/profile/myProfile' component={MyProfile}/>
        <ProtectedRoute exact path='/profile/myShortlists' component={MyShortlists}/>
        <ProtectedRoute exact path='/profile/myContacts' component={MyContacts}/>
        <ProtectedRoute exact path='/profile/myPayments' component={MyPayments}/>
        <ProtectedRoute exact path='/profile/myProperties' component={MyProperties}/>
        <ProtectedRoute exact path='/profile/enquiries' component={Enquiries}/>
        <ProtectedRoute exact path='/properties' component={PropertiesPage}/>
        <ProtectedRoute exact path='/add-property' component={AddProperty}/>
        <ProtectedRoute exact path='/view-details' component={ViewDetails}/>
      
    </Switch>
  
  </BrowserRouter>
  </>
)
}
export default App;


/*const Profile=()=>{

    return(
        
    )

}

export default Profile*/
