import { StatusBar } from 'expo-status-bar';

import './global.css';
import AppNavigator from 'AppNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  return <>
    <AppNavigator />
    <Toast position='bottom' />
    <StatusBar style='auto' />
  </>
}
