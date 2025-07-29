import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CreateActionContextExample from '../../example/CreateActionContextExample';

const ActionContextTest1: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <CreateActionContextExample />
      <CreateActionContextExample />
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default ActionContextTest1;