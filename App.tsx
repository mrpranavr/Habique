import { StatusBar } from 'expo-status-bar';
import './global.css';
import AppNavigator from 'AppNavigator';
import Toast from 'react-native-toast-message';
import { HabitsProvider } from 'context/HabitsContext';
import { ThemeProvider, useTheme } from 'context/ThemeContext';
import { View } from 'react-native';

function RootWrapper() {
  const { theme } = useTheme();


  return (
    <View className={theme} style={{ flex: 1 }}>
      <AppNavigator />
      <Toast position="bottom" />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HabitsProvider>
        <RootWrapper />
      </HabitsProvider>
    </ThemeProvider>
  );
}
