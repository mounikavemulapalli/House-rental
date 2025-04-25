import {Redirect, Route} from 'react-router-dom'
import Header from '../Header/Header.js'
import Cookie from 'js-cookie'

const ProtectedRoute = props => {
  const token = Cookie.get('jwt_token')
  if (token === undefined) {
    return <Redirect to="/login" />
  }
  return ( 
  <>
    <Header/>
    <Route {...props} />
  </>)
 
}

export default ProtectedRoute
