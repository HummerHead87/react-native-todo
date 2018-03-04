import React, { Component } from 'react';
import {  View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class Footer extends Component {
  render() {
    const {filter} = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.filtersText}>{this.props.count} count</Text>
        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filter, filter === 'ALL' && styles.selected]}
            onPress={() => this.props.onFilter('ALL')}
          >
            <Text style={styles.filtersText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filter, filter === 'ACTIVE' && styles.selected]}
            onPress={() => this.props.onFilter('ACTIVE')}
          >
            <Text style={styles.filtersText}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filter, filter === 'COMPLETED' && styles.selected]}
            onPress={() => this.props.onFilter('COMPLETED')}
          >
            <Text style={styles.filtersText}>Completed</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.props.onClearComplete}>
          <Text style={styles.filtersText}>Clear Completed</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filters: {
    flexDirection: 'row',
  },
  filtersText: {
    fontSize: 12,
  },
  filter: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: 'rgba(175, 47, 47, 0.2)',
  }
})
