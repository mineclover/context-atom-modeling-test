import React from 'react';
import { StyleSheet, View } from 'react-native';
import CreateActionContextExample from '../../example/CreateActionContextExample';

const ActionContextTest1: React.FC = () => {
  return (
    <View style={styles.container}>
      <CreateActionContextExample />
      <CreateActionContextExample />
      <CreateActionContextExample />
      <CreateActionContextExample />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default ActionContextTest1;