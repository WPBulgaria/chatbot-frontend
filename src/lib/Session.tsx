import { jwtDecode } from "jwt-decode";

export class SessionToken {
    private readonly SESSION_TOKEN_KEY = 'chatbot_session_token';
    private readonly SESSION_TOKEN_EXPIRY_KEY = 'chatbot_session_token_expiry';

    public set(token: string, expiresIn?: number) {
        localStorage.setItem(this.SESSION_TOKEN_KEY, token.trim());
        
        if (expiresIn) {
          const expiry = Date.now() + (expiresIn * 1000);
          localStorage.setItem(this.SESSION_TOKEN_EXPIRY_KEY, expiry.toString());
        }
      }
    
      public get(): any | null {
        const expiry = localStorage.getItem(this.SESSION_TOKEN_EXPIRY_KEY);
        
        if (expiry && Date.now() > parseInt(expiry)) {
          this.clear();
          return null;
        }
        const token = localStorage.getItem(this.SESSION_TOKEN_KEY);
        if (!token) {
          return null;
        }
        const decoded = jwtDecode(token);
        if (decoded.exp && Date.now() > decoded.exp * 1000) {
          this.clear();
          return null;
        }
        return token;
      }

      public getDecoded(): any | null {
        const token = this.get();
        if (!token) {
          return null;
        }
        return jwtDecode(token);
      }
    
      public clear() {
        localStorage.removeItem(this.SESSION_TOKEN_KEY);
        localStorage.removeItem(this.SESSION_TOKEN_EXPIRY_KEY);
      }
}