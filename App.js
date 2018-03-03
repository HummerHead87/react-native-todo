import React, { Component } from 'react';
import {  View, Text, StyleSheet, Platform, ListView, Keyboard } from 'react-native';
import Header from './header';
import Footer from './footer';
import Row from './row';

export default class App extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      allComplete: false,
      value: '',
      items: [],
      dataSource: ds.cloneWithRows([])
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
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({ key, ...value }) => {
              return (
                <Row
                  key={key}
                  {...value}
                  onComplete={(complete) => this.handleToggleComplete(key, complete)}
                />
              )
            }}
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator} />
            }}
          />
        </View>
        <Footer />
      </View>
    );
  }

  setSource = (items, itemsDataSource, otherState = {}) => {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
      ...otherState
    })
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

    this.setSource(newItems, newItems, { value: '' });
  }

  handleToggleComplete = (key, complete) => {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;

      return {...item, complete}
    });

    this.setSource(newItems, newItems);
  }

  handleToggleAllComplete = () => {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete
    }))

    this.setSource(newItems, newItems, { allComplete: complete })
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
  },
  list: {
    backgroundColor: '#fff',
  },
  separator: {
    borderWidth: 1,
    borderColor: '#f5f5f5',
  }
})
