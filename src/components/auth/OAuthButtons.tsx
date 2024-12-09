import { Button } from '@/components/ui/button';

export function OAuthButtons() {
  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthLogin('google')}
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google logo"
          className="h-5 w-5 mr-2"
        />
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthLogin('microsoft')}
      >
        <img
          src="https://www.svgrepo.com/show/452109/microsoft.svg"
          alt="Microsoft logo"
          className="h-5 w-5 mr-2"
        />
        Continue with Microsoft
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthLogin('facebook')}
      >
        <img
          src="https://www.svgrepo.com/show/475647/facebook-color.svg"
          alt="Facebook logo"
          className="h-5 w-5 mr-2"
        />
        Continue with Facebook
      </Button>
    </div>
  );
}