import { StatusBar } from 'expo-status-bar';

import './global.css';
import AppNavigator from 'AppNavigator';
import Toast from 'react-native-toast-message';
import { HabitsProvider } from 'context/HabitsContext';

export default function App() {
  return (
    <>
      <HabitsProvider>
        <AppNavigator />
      </HabitsProvider>
      <Toast position="bottom" />
      <StatusBar style="auto" />
    </>
  );
}
