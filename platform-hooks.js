const React = require('react');

// Minimal shim for platform-hooks used by the pasted component.
// This is a lightweight, in-memory implementation to let the app run as a demo.

const dataStore = {
  daily_logs: [],
  activity_entries: [],
  study_tasks: [],
  study_sessions: [],
  routines: []
};

function seedSampleRows(rows) {
  if (!rows) return;
  Object.keys(rows).forEach(function(key) {
    dataStore[key] = (rows[key] || []).map(function(r, i) {
      return Object.assign({ id: r.id || (key + '-' + Date.now() + '-' + i) }, r);
    });
  });
}

function useQuery(table) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(function() { /* no-op */ }, [tick]);
  return {
    data: dataStore[table] || [],
    refetch: function() { return Promise.resolve(); },
    error: null
  };
}

function useMutation(table, op) {
  return {
    mutate: function(args) {
      return new Promise(function(resolve) {
        if (op === 'insert') {
          const obj = args || {};
          const item = Object.assign({ id: table + '-' + Date.now() + '-' + Math.round(Math.random()*10000) }, obj);
          dataStore[table] = dataStore[table] || [];
          dataStore[table].push(item);
          resolve(item);
        } else if (op === 'update') {
          // args: { id, data }
          const id = args && args.id;
          const changes = args && args.data;
          if (!id) return resolve(null);
          dataStore[table] = dataStore[table] || [];
          for (let i=0;i<dataStore[table].length;i++) {
            if (dataStore[table][i].id === id) {
              dataStore[table][i] = Object.assign({}, dataStore[table][i], changes);
              return resolve(dataStore[table][i]);
            }
          }
          return resolve(null);
        }
        resolve(null);
      });
    }
  };
}

function useStorage(key, defaultValue) {
  const state = React.useState(defaultValue);
  return state;
}

function useCamera() {
  return {
    photo: null,
    error: null,
    takePhoto: function() { return Promise.resolve({}); },
    pickImage: function() { return Promise.resolve({}); }
  };
}

function useLocation() {
  return null;
}

function useCharts() {
  const EChart = function(props) {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(View, { style: { height: props.height || 120, alignItems: 'center', justifyContent: 'center' } }, React.createElement(Text, null, 'Chart placeholder'));
  };
  return { EChart };
}

module.exports = { useQuery, useMutation, useStorage, seedSampleRows, useCamera, useLocation, useCharts };
