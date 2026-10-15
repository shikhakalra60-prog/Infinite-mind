const React = require('react');
const { View, Text, TextInput, Image, ScrollView, TouchableOpacity, Modal, StatusBar, StyleSheet, Platform, Alert, LayoutAnimation, useWindowDimensions } = require('react-native');
const { Ionicons } = require('@expo/vector-icons');
const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
const { createStackNavigator } = require('@react-navigation/stack');
const { useSafeAreaInsets } = require('react-native-safe-area-context');
const { useQuery, useMutation, useStorage, seedSampleRows, useCamera, useLocation, useCharts } = require('./platform-hooks');

const ComponentFunction = function() {
  // @section:imports @depends:[]
  // imports moved to module-level for Expo compatibility
  // @end:imports

  // @section:theme @depends:[]
  var primaryColor = '#C7CCC0';
  var accentColor = '#F2A13A';
  var backgroundColor = '#101210';
  var cardColor = '#1B1E1A';
  var textPrimary = '#F2F3EC';
  var textSecondary = '#B4B9AE';
  var surfaceAltColor = '#292D27';
  var borderColor = '#3A3E37';
  var onAccentColor = '#1B160E';
  var scrimColor = 'rgba(0, 0, 0, 0.6)';
  var accentSoftColor = '#49351F';
  var radiusSm = 12;
  var radiusMd = 20;
  var radiusPill = 999;
  var visualDesign = 'Warm charcoal dark mode with amber highlights, restrained rounded cards, compact rows, clear sans-serif typography, and a generous four-point spacing rhythm.';
  var TAB_MENU_HEIGHT = Platform.OS === 'web' ? 56 : 49;
  var SCROLL_EXTRA_PADDING = 16;
  var FAB_SPACING = 16;
  var DEFAULT_PREFERENCES = { calorieTarget: 2100, waterTarget: 2400, focusTarget: 120, morningReminder: true, eveningReminder: true };
  var todayKey = function() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  var notice = function(message) { Platform.OS === 'web' ? window.alert(message) : Alert.alert('Thirvo', message); };
  var number = function(value) { return Number(value) || 0; };
  var capped = function(value) { return Math.max(0, Math.min(100, Math.round(value))); };
  var asSteps = function(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') { try { var parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch (error) { return []; } }
    return [];
  };
  // @end:theme

  // @section:navigation-setup @depends:[]
  var Tab = createBottomTabNavigator();
  var Stack = createStackNavigator();
  // @end:navigation-setup

  // @section:ThemeContext @depends:[theme]
  var ThemeContext = React.createContext(null);
  var ThemeProvider = function(props) {
    var theme = { colors: { primary: primaryColor, accent: accentColor, background: backgroundColor, card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary } };
    return React.createElement(ThemeContext.Provider, { value: { theme: theme, darkMode: true, toggleDarkMode: function() {}, visualDesign: visualDesign } }, props.children);
  };
  var useTheme = function() { return React.useContext(ThemeContext); };
  // @end:ThemeContext

  // @section:sample-data @depends:[]
  var SAMPLE_ROWS = {
    daily_logs: [
      { log_date: '@day(0)', calories: 1420, protein_grams: 82, carbs_grams: 145, fats_grams: 48, water_ml: 1500, harmony_score: 0 },
      { log_date: '@day(-1)', calories: 1870, protein_grams: 94, carbs_grams: 201, fats_grams: 62, water_ml: 2200, harmony_score: 0 },
      { log_date: '@day(-2)', calories: 1690, protein_grams: 88, carbs_grams: 174, fats_grams: 55, water_ml: 1900, harmony_score: 0 },
      { log_date: '@day(-3)', calories: 2050, protein_grams: 105, carbs_grams: 210, fats_grams: 68, water_ml: 2400, harmony_score: 0 }
    ],
    activity_entries: [
      { activity_category: 'fitness', activity_name: 'Upper-body strength', activity_date: '@day(0)', activity_details: { minutes: 42, sets: 6, reps: 10, weight: 18 } },
      { activity_category: 'social', activity_name: 'Daily conversation drill', activity_date: '@day(0)', activity_details: { scenario: 'Ask a classmate to study together this week.', partner: 'Classmate' }, confidence_score: 60 },
      { activity_category: 'skincare', activity_name: 'Morning skincare', activity_date: '@day(0)', activity_details: { routine: 'AM' } },
      { activity_category: 'social', activity_name: 'Coffee with Alex', activity_date: '@day(-1)', activity_details: { scenario: 'Asked a follow-up about their new role and shared my own experience.', partner: 'Alex' }, confidence_score: 74 },
      { activity_category: 'fitness', activity_name: 'Evening mobility', activity_date: '@day(-2)', activity_details: { minutes: 25 } }
    ],
    study_tasks: [
      { task_title: 'Review cell respiration notes', task_category: 'Biology', is_completed: false, target_date: '@day(0)' },
      { task_title: 'Balance redox equations from the practice set', task_category: 'Chemistry', is_completed: false, target_date: '@day(0)' },
      { task_title: 'Make flashcards for the Krebs cycle', task_category: 'Biology', is_completed: false, target_date: '@day(0)' },
      { task_title: 'Outline the history essay', task_category: 'History', is_completed: true, target_date: '@day(-1)' }
    ],
    study_sessions: [
      { task_id: null, session_category: 'Chemistry', focus_minutes: 25, session_started_at: '@day(0 10:15)' },
      { task_id: null, session_category: 'Biology', focus_minutes: 35, session_started_at: '@day(-1 14:10)' },
      { task_id: null, session_category: 'History', focus_minutes: 45, session_started_at: '@day(-2 09:30)' },
      { task_id: null, session_category: 'Chemistry', focus_minutes: 25, session_started_at: '@day(-3 11:00)' }
    ],
    routines: [
      { routine_category: 'workout', routine_title: 'Strength day', routine_steps: [{ name: 'Goblet squat', detail: '3 sets · 10 reps' }, { name: 'Dumbbell row', detail: '3 sets · 10 each side' }, { name: 'Romanian deadlift', detail: '3 sets · 8 reps' }, { name: 'Cool down and stretch', detail: '5 minutes' }], is_active: true },
      { routine_category: 'skincare_am', routine_title: 'AM skincare', routine_steps: [{ name: 'Gentle cleanser', detail: 'Rinse with lukewarm water' }, { name: 'Vitamin C serum', detail: '2 drops · face and neck' }, { name: 'SPF 50 sunscreen', detail: 'Apply before heading out' }], is_active: true },
      { routine_category: 'skincare_pm', routine_title: 'PM skincare', routine_steps: [{ name: 'Remove sunscreen and makeup', detail: 'Oil cleanser' }, { name: 'Barrier repair moisturizer', detail: 'Face and neck' }, { name: 'Log skin photo', detail: 'Same light, front-facing' }], is_active: true }
    ]
  };
  // @end:sample-data

  // @section:shared-components @depends:[theme,styles]
  var IconButton = function(props) {
    return React.createElement(TouchableOpacity, { style: styles.iconButton, activeOpacity: 0.7, onPress: props.onPress, componentId: props.componentId },
      React.createElement(Ionicons, { name: props.name, size: 24, color: props.color || textPrimary }));
  };
  var ActionButton = function(props) {
    return React.createElement(TouchableOpacity, { style: [styles.action, props.pill && styles.pill], activeOpacity: 0.7, onPress: props.onPress, componentId: props.componentId },
      props.icon ? React.createElement(Ionicons, { name: props.icon, size: 20, color: onAccentColor, componentId: props.componentId + '-icon' }) : null,
      React.createElement(Text, { style: styles.actionText, componentId: props.componentId + '-label' }, props.title));
  };
  var PageHeader = function(props) {
    return React.createElement(View, { style: styles.header, componentId: props.componentId + '-header' },
      props.back ? React.createElement(IconButton, { name: 'chevron-back', onPress: props.back, componentId: props.componentId + '-back' }) : null,
      React.createElement(Text, { style: styles.title, numberOfLines: 1, componentId: props.componentId + '-title' }, props.title),
      props.action ? React.createElement(TouchableOpacity, { style: styles.headerTextButton, onPress: props.action, activeOpacity: 0.7, componentId: props.componentId + '-action' },
        props.actionIcon ? React.createElement(Ionicons, { name: props.actionIcon, size: 24, color: accentColor }) : React.createElement(Text, { style: styles.linkText }, props.actionLabel)) : null);
  };
  var Field = function(props) {
    return React.createElement(View, { style: { marginBottom: 12 }, componentId: props.componentId + '-group' },
      React.createElement(Text, { style: styles.fieldLabel, componentId: props.componentId + '-label' }, props.label),
      React.createElement(TextInput, {
        style: [styles.input, props.multiline && styles.multiInput], value: props.value, onChangeText: props.onChangeText,
        placeholder: props.placeholder || props.label, placeholderTextColor: textSecondary,
        keyboardType: props.keyboardType || 'default', autoCapitalize: props.autoCapitalize || 'sentences',
        autoCorrect: props.autoCorrect !== false, multiline: !!props.multiline,
        numberOfLines: props.multiline ? 4 : 1, textAlignVertical: props.multiline ? 'top' : 'center',
        componentId: props.componentId
      }));
  };
  var EmptyBlock = function(props) {
    return React.createElement(View, { style: styles.empty, componentId: props.componentId },
      React.createElement(View, { style: styles.emptyIcon, componentId: props.componentId + '-icon-box' },
        React.createElement(Ionicons, { name: props.icon, size: 28, color: accentColor })),
      React.createElement(Text, { style: styles.sectionTitle, componentId: props.componentId + '-title' }, props.title),
      React.createElement(Text, { style: styles.emptyCopy, componentId: props.componentId + '-copy' }, props.copy),
      props.action ? React.createElement(ActionButton, { title: props.action, onPress: props.onPress, componentId: props.componentId + '-action' }) : null);
  };
  // @end:shared-components

  // @section:TodayScreen @depends:[ThemeContext,shared-components,styles]
  var TodayScreen = function(props) {
    var insets = useSafeAreaInsets();
    var themeContext = useTheme();
    var theme = themeContext.theme;
    var logsQuery = useQuery('daily_logs');
    var activitiesQuery = useQuery('activity_entries');
    var sessionsQuery = useQuery('study_sessions');
    var preferencesState = useStorage('preferences', DEFAULT_PREFERENCES);
    var preferences = preferencesState[0] || DEFAULT_PREFERENCES;
    var date = todayKey();
    var log = logsQuery.data.find(function(row) { return row && row.log_date === date; }) || {};
    var activities = activitiesQuery.data.filter(function(row) { return row && row.activity_date === date; });
    var sessions = sessionsQuery.data.filter(function(row) { return row && String(row.session_started_at || '').slice(0, 10) === date; });
    var focusMinutes = sessions.reduce(function(total, row) { return total + number(row.focus_minutes); }, 0);
    var fitness = activities.some(function(row) { return row.activity_category === 'fitness'; });
    var social = activities.some(function(row) { return row.activity_category === 'social'; });
    var skincare = activities.some(function(row) { return row.activity_category === 'skincare'; });
    var percentages = [
      capped(number(log.calories) / Math.max(1, preferences.calorieTarget) * 100),
      fitness ? 100 : 0,
      capped(focusMinutes / Math.max(1, preferences.focusTarget) * 100),
      social ? 100 : 0,
      skincare ? 100 : 0
    ];
    var score = Math.round(percentages.reduce(function(sum, value) { return sum + value; }, 0) / 5);
    var labels = ['Health & nutrition', 'Physical fitness', 'Academics & studies', 'Social & communication skills', 'Skincare'];
    var details = [
      number(log.calories) ? number(log.calories).toLocaleString() + ' of ' + preferences.calorieTarget.toLocaleString() + ' kcal' : 'No meals or water logged',
      fitness ? 'Workout complete' : 'No workout recorded',
      focusMinutes ? focusMinutes + ' focused minutes' : 'No focus session today',
      social ? 'Conversation drill logged' : 'No conversation or drill logged',
      skincare ? 'Routine checked in' : 'No routine steps completed'
    ];
    var loadError = logsQuery.error || activitiesQuery.error || sessionsQuery.error;
    return React.createElement(View, { style: styles.tabPage, componentId: 'today-screen' },
      React.createElement(StatusBar, { backgroundColor: backgroundColor, barStyle: 'light-content' }),
      React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING }, componentId: 'today-scroll' },
        React.createElement(Text, { style: styles.title, componentId: 'today-title' }, 'Today'),
        loadError ? React.createElement(EmptyBlock, { icon: 'refresh', title: 'Today’s balance is unavailable', copy: 'Your pillar totals could not load.', action: 'Retry', onPress: function() { logsQuery.refetch(); activitiesQuery.refetch(); sessionsQuery.refetch(); }, componentId: 'today-error' }) :
        React.createElement(View, { componentId: 'today-content' },
          React.createElement(View, { style: styles.scoreCard, componentId: 'today-score-card' },
            React.createElement(View, { style: styles.between, componentId: 'today-score-top' },
              React.createElement(Text, { style: styles.overline, componentId: 'today-score-label' }, 'DAILY HARMONY'),
              React.createElement(View, { style: styles.dot, componentId: 'today-score-dot' })),
            React.createElement(View, { style: styles.reading, componentId: 'today-score-reading' },
              React.createElement(Text, { style: styles.bigNumber, componentId: 'today-score-value' }, String(score)),
              React.createElement(Text, { style: styles.bodyMuted, componentId: 'today-score-unit' }, '/ 100')),
            React.createElement(Text, { style: styles.body, componentId: 'today-score-caption' }, score ? 'A steady day is taking shape. One small win can bring your pillars closer.' : 'Your day starts with one small entry. Log a meal, workout, study session, conversation, or skincare step.'),
            !score ? React.createElement(ActionButton, { title: 'Log your first entry', onPress: function() { props.navigation.navigate('Log'); }, componentId: 'today-first-entry' }) : null),
          React.createElement(Text, { style: [styles.overline, { marginTop: 24, marginBottom: 12 }], componentId: 'today-pillars-heading' }, 'YOUR FIVE PILLARS'),
          labels.map(function(label, index) {
            return React.createElement(TouchableOpacity, { key: label, style: styles.pillarRow, activeOpacity: 0.7, onPress: function() { props.navigation.navigate(index === 2 ? 'Focus' : index === 3 ? 'Coach' : 'Log'); }, componentId: 'today-pillar-' + index },
              React.createElement(View, { style: [styles.pillarMark, { backgroundColor: percentages[index] ? accentColor : borderColor }], componentId: 'today-pillar-mark-' + index }),
              React.createElement(View, { style: { flex: 1 }, componentId: 'today-pillar-copy-' + index },
                React.createElement(Text, { style: styles.rowTitle, numberOfLines: 1, componentId: 'today-pillar-name-' + index }, label),
                React.createElement(Text, { style: styles.smallMuted, numberOfLines: 1, componentId: 'today-pillar-detail-' + index }, details[index])),
              React.createElement(Text, { style: [styles.rowTitle, { color: percentages[index] > 0 && percentages[index] < 100 ? accentColor : textPrimary }], componentId: 'today-pillar-value-' + index }, percentages[index] + '%'));
          }))));
  };
  // @end:TodayScreen

  // @section:LogScreen @depends:[shared-components,styles]
  var LogScreen = function(props) {
    var insets = useSafeAreaInsets();
    var height = useWindowDimensions().height;
    var camera = useCamera();
    var activitiesQuery = useQuery('activity_entries');
    var logsQuery = useQuery('daily_logs');
    var routinesQuery = useQuery('routines');
    var sheetState = React.useState(false);
    var sheetOpen = sheetState[0];
    var setSheetOpen = sheetState[1];
    var date = todayKey();
    var todayActivities = activitiesQuery.data.filter(function(row) { return row && row.activity_date === date; });
    var todayLog = logsQuery.data.find(function(row) { return row && row.log_date === date; });
    var sheetHeight = Math.round(((Platform.OS === 'web' && typeof window !== 'undefined' && window.__thunkablePhoneFrameHeight) || height) * 0.52);
    var entries = todayActivities.map(function(row) { return { id: row.id, name: row.activity_name || 'Activity', detail: row.activity_category || 'Activity', icon: row.activity_category === 'fitness' ? 'barbell-outline' : row.activity_category === 'skincare' ? 'camera-outline' : 'chatbubble-ellipses-outline' }; });
    if (todayLog && number(todayLog.calories)) entries.unshift({ id: 'nutrition', name: 'Daily nutrition', detail: number(todayLog.calories).toLocaleString() + ' kcal · ' + number(todayLog.protein_grams) + 'g protein', icon: 'restaurant-outline' });
    return React.createElement(View, { style: styles.tabPage, componentId: 'log-screen' },
      React.createElement(StatusBar, { backgroundColor: backgroundColor, barStyle: 'light-content' }),
      React.createElement(View, { style: { paddingTop: insets.top, paddingHorizontal: 16 }, componentId: 'log-header-wrap' },
        React.createElement(PageHeader, { title: 'Log', actionIcon: 'add', action: function() { setSheetOpen(true); }, componentId: 'log' })),
      React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING }, componentId: 'log-scroll' },
        React.createElement(Text, { style: styles.smallMuted, componentId: 'log-date' }, 'Today · ' + new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })),
        entries.length ? React.createElement(View, { style: [styles.card, { marginTop: 12 }], componentId: 'log-entries' }, entries.map(function(entry, index) {
          return React.createElement(View, { key: String(entry.id || index), style: [styles.entryRow, index > 0 && styles.divider], componentId: 'log-entry-' + index },
            React.createElement(View, { style: styles.entryIcon, componentId: 'log-entry-icon-' + index }, React.createElement(Ionicons, { name: entry.icon, size: 24, color: primaryColor })),
            React.createElement(View, { style: { flex: 1 }, componentId: 'log-entry-copy-' + index },
              React.createElement(Text, { style: styles.rowTitle, numberOfLines: 1, componentId: 'log-entry-name-' + index }, entry.name),
              React.createElement(Text, { style: styles.smallMuted, numberOfLines: 1, componentId: 'log-entry-detail-' + index }, entry.detail)));
        })) : React.createElement(EmptyBlock, { icon: 'add', title: 'Start your daily log', copy: 'Track a meal, workout, or skincare routine to build a clearer picture of your day.', action: 'Add entry', onPress: function() { setSheetOpen(true); }, componentId: 'log-empty' }),
        React.createElement(Text, { style: [styles.sectionTitle, { marginTop: 24, marginBottom: 12 }], componentId: 'log-skincare-title' }, 'Evening skincare'),
        routinesQuery.data.filter(function(row) { return row && row.routine_category === 'skincare_pm'; }).map(function(routine) {
          return React.createElement(View, { key: routine.id, style: styles.card, componentId: 'log-routine-' + routine.id },
            asSteps(routine.routine_steps).map(function(step, index) {
              return React.createElement(View, { key: String(index), style: styles.entryRow, componentId: 'log-routine-step-' + index },
                React.createElement(Ionicons, { name: 'ellipse-outline', size: 24, color: borderColor }),
                React.createElement(Text, { style: [styles.rowTitle, { flex: 1, marginLeft: 12 }], componentId: 'log-routine-step-title-' + index }, step.name || 'Step'));
            }));
        }),
        !routinesQuery.data.some(function(row) { return row && row.routine_category === 'skincare_pm'; }) ? React.createElement(Text, { style: styles.smallMuted, componentId: 'log-no-routine' }, 'No evening routine yet.') : null),
      React.createElement(Modal, { visible: sheetOpen, transparent: true, animationType: 'slide', onRequestClose: function() { setSheetOpen(false); }, componentId: 'log-sheet-modal' },
        React.createElement(View, { style: [styles.sheetOverlay, { marginTop: insets.top }], componentId: 'log-sheet-overlay' },
          React.createElement(View, { style: [styles.sheet, { height: sheetHeight, paddingBottom: insets.bottom + 16 }], componentId: 'log-sheet' },
            React.createElement(View, { style: styles.handle, componentId: 'log-sheet-handle' }),
            React.createElement(View, { style: styles.between, componentId: 'log-sheet-heading' },
              React.createElement(Text, { style: styles.sectionTitle, componentId: 'log-sheet-title' }, 'Add an entry'),
              React.createElement(IconButton, { name: 'close', onPress: function() { setSheetOpen(false); }, componentId: 'log-sheet-close' })),
            React.createElement(Text, { style: styles.smallMuted, componentId: 'log-sheet-intro' }, 'Choose what you want to log.'),
            [['Food', 'Scan a meal or describe what you ate', 'restaurant-outline'], ['Workout', 'Record exercises, sets and reps', 'barbell-outline'], ['Skincare', 'Check off a routine or take a progress photo', 'camera-outline']].map(function(option, index) {
              return React.createElement(TouchableOpacity, { key: option[0], style: styles.sheetOption, activeOpacity: 0.7, onPress: function() { setSheetOpen(false); props.navigation.navigate('AddEntry', { category: option[0] }); }, componentId: 'log-sheet-option-' + index },
                React.createElement(View, { style: styles.sheetOptionIcon, componentId: 'log-sheet-option-icon-' + index }, React.createElement(Ionicons, { name: option[2], size: 24, color: accentColor })),
                React.createElement(View, { style: { flex: 1 }, componentId: 'log-sheet-option-copy-' + index },
                  React.createElement(Text, { style: styles.rowTitle, componentId: 'log-sheet-option-title-' + index }, option[0]),
                  React.createElement(Text, { style: styles.smallMuted, componentId: 'log-sheet-option-detail-' + index }, option[1])),
                React.createElement(Ionicons, { name: 'chevron-forward', size: 20, color: textSecondary }));
            })));
  };
  // @end:LogScreen

  // @section:AddEntryScreen @depends:[shared-components,styles]
  var AddEntryScreen = function(props) {
    var insets = useSafeAreaInsets();
    var camera = useCamera();
    var location = useLocation();
    var category = props.route && props.route.params ? props.route.params.category || 'Food' : 'Food';
    var nameState = React.useState('');
    var name = nameState[0];
    var setName = nameState[1];
    var caloriesState = React.useState('');
    var calories = caloriesState[0];
    var setCalories = caloriesState[1];
    var proteinState = React.useState('');
    var protein = proteinState[0];
    var setProtein = proteinState[1];
    var carbsState = React.useState('');
    var carbs = carbsState[0];
    var setCarbs = carbsState[1];
    var fatsState = React.useState('');
    var fats = fatsState[0];
    var setFats = fatsState[1];
    var waterState = React.useState('');
    var water = waterState[0];
    var setWater = waterState[1];
    var setsState = React.useState('');
    var sets = setsState[0];
    var setSets = setsState[1];
    var repsState = React.useState('');
    var reps = repsState[0];
    var setReps = repsState[1];
    var weightState = React.useState('');
    var weight = weightState[0];
    var setWeight = weightState[1];
    var successState = React.useState(false);
    var success = successState[0];
    var setSuccess = successState[1];
    var logsQuery = useQuery('daily_logs');
    var insertLog = useMutation('daily_logs', 'insert');
    var updateLog = useMutation('daily_logs', 'update');
    var insertActivity = useMutation('activity_entries', 'insert');
    var preferencesState = useStorage('preferences', DEFAULT_PREFERENCES);
    var preferences = preferencesState[0] || DEFAULT_PREFERENCES;
    var existing = logsQuery.data.find(function(row) { return row && row.log_date === todayKey(); });
    var numericInput = function(setter) { return function(value) { setter(value.replace(/[^0-9.]/g, '')); }; };
    var save = function() {
      if (category === 'Food') {
        if (!name.trim() && !number(water)) { notice('Describe your food or enter water intake first.'); return; }
        var values = {
          calories: number(existing?.calories) + number(calories),
          protein_grams: number(existing?.protein_grams) + number(protein),
          carbs_grams: number(existing?.carbs_grams) + number(carbs),
          fats_grams: number(existing?.fats_grams) + number(fats),
          water_ml: number(existing?.water_ml) + number(water),
          harmony_score: 0
        };
        var request = existing ? updateLog.mutate({ id: existing.id, data: values }) : insertLog.mutate(Object.assign({ log_date: todayKey() }, values));
        request.then(function() { logsQuery.refetch(); setSuccess(true); }, function(error) { notice(error.message || 'Could not save entry.'); });
      } else {
        if (!name.trim()) { notice('Enter an activity name first.'); return; }
        insertActivity.mutate({
          activity_category: category === 'Workout' ? 'fitness' : 'skincare',
          activity_name: name.trim(),
          activity_date: todayKey(),
          activity_details: category === 'Workout' ? { sets: number(sets), reps: number(reps), weight: number(weight) } : { photo: camera.photo?.uri || '' }
        }).then(function() { setSuccess(true); }, function(error) { notice(error.message || 'Could not save entry.'); });
      }
    };
    var takePicture = function(pick) {
      var action = pick ? camera.pickImage : camera.takePhoto;
      action().then(function(result) { if (result.error) notice(result.error); });
    };
    return React.createElement(View, { style: [styles.stackPage, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }], componentId: 'add-entry-screen' },
      React.createElement(StatusBar, { backgroundColor: backgroundColor, barStyle: 'light-content' }),
      React.createElement(PageHeader, { title: 'Add entry', back: function() { props.navigation.goBack(); }, componentId: 'add-entry' }),
      success ? React.createElement(View, { style: { flex: 1, justifyContent: 'center' }, componentId: 'add-entry-success' },
        React.createElement(Ionicons, { name: 'checkmark-circle-outline', size: 48, color: accentColor }),
        React.createElement(Text, { style: [styles.title, { marginTop: 12 }], componentId: 'add-entry-success-title' }, 'Entry logged'),
        React.createElement(Text, { style: [styles.bodyMuted, { marginTop: 8, marginBottom: 24 }], componentId: 'add-entry-success-copy' }, (name || 'Water') + ' added to today’s progress.'),
        React.createElement(View, { style: styles.cardPadded, componentId: 'add-entry-success-card' },
          React.createElement(Text, { style: styles.rowTitle, componentId: 'add-entry-saved-name' }, name || 'Water'),
          React.createElement(Text, { style: styles.bigNumber, componentId: 'add-entry-saved-value' }, category === 'Food' ? String(number(calories)) : '✓'),
          React.createElement(Text, { style: styles.smallMuted, componentId: 'add-entry-saved-unit' }, category === 'Food' ? 'calories · ' + Math.max(0, preferences.calorieTarget - number(existing?.calories)) + ' kcal remaining' : category + ' complete')),
        React.createElement(ActionButton, { title: 'Add another entry', onPress: function() { setSuccess(false); setName(''); setCalories(''); setProtein(''); setCarbs(''); setFats(''); setWater(''); }, componentId: 'add-entry-again' })) :
      React.createElement(React.Fragment, null,
        React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingTop: 16, paddingBottom: 24 }, componentId: 'add-entry-scroll' },
          React.createElement(Text, { style: [styles.smallMuted, { marginBottom: 16 }], componentId: 'add-entry-timestamp' }, 'Today · ' + new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })),
          category === 'Food' ? React.createElement(Image, { source: camera.photo?.uri ? { uri: camera.photo.uri } : { uri: 'IMAGE:greek-yogurt-blueberries' }, style: styles.foodImage, resizeMode: 'cover', componentId: 'add-entry-food-photo' }) : camera.photo?.uri ? React.createElement(Image, { source: { uri: camera.photo.uri }, style: styles.foodImage, componentId: 'add-entry-captured-photo' }) : null,
          category !== 'Workout' ? React.createElement(View, { style: { flexDirection: 'row', gap: 8, marginTop: 8 }, componentId: 'add-entry-camera-actions' },
            React.createElement(TouchableOpacity, { style: [styles.cameraAction, { flex: 1 }], onPress: function() { takePicture(false); }, activeOpacity: 0.7, componentId: 'add-entry-take-photo' },
              React.createElement(Ionicons, { name: 'camera-outline', size: 24, color: accentColor }),
              React.createElement(Text, { style: styles.linkText, componentId: 'add-entry-take-photo-label' }, 'Take photo')),
            React.createElement(TouchableOpacity, { style: [styles.cameraAction, { flex: 1 }], onPress: function() { takePicture(true); }, activeOpacity: 0.7, componentId: 'add-entry-pick-photo' },
              React.createElement(Ionicons, { name: 'images-outline', size: 24, color: accentColor }),
              React.createElement(Text, { style: styles.linkText, componentId: 'add-entry-pick-photo-label' }, 'Upload'))) : null,
          camera.error ? React.createElement(Text, { style: styles.smallMuted, componentId: 'add-entry-camera-error' }, camera.error) : null,
          React.createElement(Text, { style: [styles.sectionTitle, { marginTop: 24, marginBottom: 12 }], componentId: 'add-entry-section-title' }, category === 'Food' ? 'Meal details' : category === 'Workout' ? 'Workout details' : 'Skincare check-in'),
          React.createElement(Field, { label: category === 'Food' ? 'Food description' : category === 'Workout' ? 'Exercise or workout' : 'Routine or skin note', value: name, onChangeText: setName, componentId: 'add-entry-name' }),
          category === 'Food' ? React.createElement(View, { componentId: 'add-entry-nutrition-fields' },
            React.createElement(Field, { label: 'Calories · kcal', value: calories, keyboardType: 'decimal-pad', onChangeText: numericInput(setCalories), componentId: 'add-entry-calories' }),
            React.createElement(Field, { label: 'Protein · g', value: protein, keyboardType: 'decimal-pad', onChangeText: numericInput(setProtein), componentId: 'add-entry-protein' }),
            React.createElement(Field, { label: 'Carbohydrates · g', value: carbs, keyboardType: 'decimal-pad', onChangeText: numericInput(setCarbs), componentId: 'add-entry-carbs' }),
            React.createElement(Field, { label: 'Fats · g', value: fats, keyboardType: 'decimal-pad', onChangeText: numericInput(setFats), componentId: 'add-entry-fats' }),
            React.createElement(Field, { label: 'Water · ml', value: water, keyboardType: 'numeric', onChangeText: function(value) { setWater(value.replace(/[^0-9]/g, '')); }, componentId: 'add-entry-water' }),
            React.createElement(Text, { style: styles.smallMuted, componentId: 'add-entry-estimate-note' }, 'Enter the nutrition shown on your label. Photo recognition is not available without a configured recognition service.')) : null,
          category === 'Workout' ? React.createElement(View, { componentId: 'add-entry-workout-fields' },
            React.createElement(Field, { label: 'Sets', value: sets, keyboardType: 'numeric', onChangeText: function(value) { setSets(value.replace(/[^0-9]/g, '')); }, componentId: 'add-entry-sets' }),
            React.createElement(Field, { label: 'Reps', value: reps, keyboardType: 'numeric', onChangeText: function(value) { setReps(value.replace(/[^0-9]/g, '')); }, componentId: 'add-entry-reps' }),
            React.createElement(Field, { label: 'Weight · kg', value: weight, keyboardType: 'decimal-pad', onChangeText: numericInput(setWeight), componentId: 'add-entry-weight' })) : null),
        React.createElement(ActionButton, { title: 'Save entry', onPress: save, componentId: 'add-entry-save' }));
  };
  // @end:AddEntryScreen

  // @section:FocusScreen @depends:[shared-components,styles]
  var FocusScreen = function(props) {
    var insets = useSafeAreaInsets();
    var tasksQuery = useQuery('study_tasks');
    var sessionsQuery = useQuery('study_sessions');
    var updateTask = useMutation('study_tasks', 'update');
    var upcoming = tasksQuery.data.filter(function(row) { return row && !row.is_completed; });
    var sessions = sessionsQuery.data.filter(function(row) { return row && String(row.session_started_at || '').slice(0, 10) === todayKey(); });
    return React.createElement(View, { style: styles.tabPage, componentId: 'focus-screen' },
      React.createElement(StatusBar, { backgroundColor: backgroundColor, barStyle: 'light-content' }),
      React.createElement(View, { style: { paddingTop: insets.top, paddingHorizontal: 16 }, componentId: 'focus-header-wrap' },
        React.createElement(View, { style: styles.header, componentId: 'focus-header' },
          React.createElement(Text, { style: [styles.title, { flex: 1 }], componentId: 'focus-title' }, 'Focus'),
          React.createElement(IconButton, { name: 'add', onPress: function() { props.navigation.navigate('TaskEditor'); }, componentId: 'focus-new-task' }),
          React.createElement(IconButton, { name: 'play', onPress: function() { props.navigation.navigate('FocusSession', { taskId: upcoming[0]?.id || null }); }, componentId: 'focus-play' })));
// Seed sample data for the demo environment (no-op if platform-hooks is replaced)
try { if (typeof seedSampleRows === 'function') seedSampleRows(SAMPLE_ROWS); } catch (e) {}

module.exports = ComponentFunction;