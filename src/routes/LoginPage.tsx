import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const login = useGoogleLogin({
    flow: 'auth-code',
    onError: () => {},
    redirect_uri: 'http://localhost:3001/google-callback',
    ux_mode: 'redirect',
  });
  return (
    <div id="loginPageBackground">
      <div className="loginBorder">
        <h1 id="loginPrompt">Welcome to Bee-kb</h1>
        <div id="googleAuthProvider">
          <button id="loginButton" onClick={() => login()} type="button">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
