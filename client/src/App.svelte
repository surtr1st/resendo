<script lang="ts">
  import { useAuth } from './services';
  import { Route, useLocation, useNavigate } from 'svelte-navigator';
  import LoginOrRegistrate from './layouts/LoginOrRegistrate.svelte';
  import ChatApp from './layouts/ChatApp.svelte';
  import { onMount } from 'svelte';

  const { accessToken, isAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  onMount(() => {
    if ((isAuth || accessToken) && $location.pathname === '/')
      navigate('/chat');
    if ((!isAuth || !accessToken) && $location.pathname === '/') navigate('/');
  });
</script>

<Route
  path="/"
  primary={false}
>
  <LoginOrRegistrate />
</Route>
<Route
  path="/chat/*"
  primary={false}
>
  <ChatApp />
</Route>
