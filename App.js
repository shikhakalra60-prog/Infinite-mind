import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
const ThirvoComponent = require('./ThirvoComponent');

export default function App() {
  const Root = ThirvoComponent();
  return React.createElement(NavigationContainer, null, Root);
}
