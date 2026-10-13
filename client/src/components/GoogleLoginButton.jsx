import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton({ onSuccess }) {
  return (
    <GoogleLogin
      onSuccess={(response) => {
        if (response.credential) {
          onSuccess(response.credential);
        }
      }}
      onError={() => {
        console.log("Google Signin Failed");
      }}
    />
  );
}
