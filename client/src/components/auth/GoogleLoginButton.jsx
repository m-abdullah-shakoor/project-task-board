import { useCallback, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

// Google's button needs an explicit pixel width (200-400), so measure the
// container once it mounts and render the button to fit it.
export default function GoogleLoginButton({ onSuccess, onError }) {
  const [width, setWidth] = useState(0);

  const measure = useCallback((node) => {
    if (node) {
      const available = Math.floor(node.getBoundingClientRect().width);
      setWidth(Math.min(400, Math.max(200, available)));
    }
  }, []);

  return (
    <div ref={measure} className="flex min-h-10 justify-center">
      {width > 0 && (
        <GoogleLogin
          width={width}
          theme="outline"
          size="large"
          shape="rectangular"
          text="continue_with"
          logo_alignment="center"
          onSuccess={(response) => {
            if (response.credential) onSuccess(response.credential);
            else onError();
          }}
          onError={onError}
        />
      )}
    </div>
  );
}
