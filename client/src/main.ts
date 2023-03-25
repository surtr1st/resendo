import './app.css';
import AppWrapper from './AppWrapper.svelte';

const app = new AppWrapper({
  target: document.getElementById('app'),
});

export default app;
