import { createDrawerNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomePage from './pages/home';
import AboutPage from './pages/about'
export default createDrawerNavigator({
  Home: HomePage,
  About: AboutPage,
});
