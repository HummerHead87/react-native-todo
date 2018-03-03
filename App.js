import React, { Component } from 'react';
import {  View, Text, StyleSheet, Platform } from 'react-native';
import Header from './header';
import Footer from './footer';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allComplete: false,
      value: '',
      items: [],
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({ value })}
          onToggleAllComplete={this.handleToggleAllComplete}
        />
        <View style={styles.content}>
          <Text>Content</Text>
        </View>
        <Footer />
      </View>
    );
  }

  handleAddItem = () => {
    const { value, items } = this.state
    if (!value) return;
  
    const newItems = [
      ...items,
      {
        key: Date.now(),
        text: value,
        complete: false
      }
    ];
    console.log('add todo', value)

    this.setState({
      items: newItems,
      value: '',
    })
  }

  handleToggleAllComplete = () => {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete
    }))
    console.table(newItems);

    this.setState({
      items: newItems,
      allComplete: complete
    })
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      ios: { paddingTop: 30 },
      android: { paddingTop: 50 }
    })
  },
  content: {
    flex: 1,
  }
})
