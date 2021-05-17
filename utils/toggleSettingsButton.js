// eslint-disable-next-line no-unused-vars
function toggleSettings() {
  const checkbox = document.getElementById('settingsToggle');
  const label = document.getElementById('settingsButton');
  if (!checkbox.checked) {
    label.className = 'settingsbuttonToggled';
  } else {
    label.className = 'settingsbutton';
  }
}
