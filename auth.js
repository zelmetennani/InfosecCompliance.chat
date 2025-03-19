// auth.js - Client-side authentication handler
class Auth {
  constructor() {
    this.user = null;
    this.isLoading = false;
    this.error = null;
    
    // Initialize Firebase client SDK (without config)
    this.initFirebase();
    
    // Check for existing session
    this.checkAuthState();
  }
  
  async initFirebase() {
    // Import Firebase only when needed
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js');
    const { getAuth, signInWithCustomToken, onAuthStateChanged, signOut } = 
      await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
    
    // Initialize Firebase with minimal config (no API keys)
    // We only need the project ID which is not sensitive
    const app = initializeApp({
      projectId: "infoseccompliance-chat"
    });
    
    this.auth = getAuth(app);
    this.signInWithCustomToken = signInWithCustomToken;
    this.onAuthStateChanged = onAuthStateChanged;
    this.signOut = signOut;
    
    // Set up auth state listener
    this.onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      this.updateUI();
    });
  }
  
  async checkAuthState() {
    // Check if user is already signed in
    this.isLoading = true;
    this.updateUI();
    
    // Wait for Firebase Auth to initialize
    if (!this.auth) {
      await new Promise(resolve => {
        const checkAuth = () => {
          if (this.auth) {
            resolve();
          } else {
            setTimeout(checkAuth, 100);
          }
        };
        checkAuth();
      });
    }
    
    this.isLoading = false;
    this.updateUI();
  }
  
  async signUp(email, password) {
    try {
      this.isLoading = true;
      this.error = null;
      this.updateUI();
      
      const response = await fetch('/.netlify/functions/firebase-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signUp',
          email,
          password
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign up');
      }
      
      // Sign in with the custom token
      await this.signInWithCustomToken(this.auth, data.token);
      
      this.isLoading = false;
      this.updateUI();
      return true;
    } catch (error) {
      this.isLoading = false;
      this.error = error.message;
      this.updateUI();
      return false;
    }
  }
  
  async signIn(email, password) {
    try {
      this.isLoading = true;
      this.error = null;
      this.updateUI();
      
      const response = await fetch('/.netlify/functions/firebase-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signIn',
          email,
          password
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign in');
      }
      
      // Sign in with the custom token
      await this.signInWithCustomToken(this.auth, data.token);
      
      this.isLoading = false;
      this.updateUI();
      return true;
    } catch (error) {
      this.isLoading = false;
      this.error = error.message;
      this.updateUI();
      return false;
    }
  }
  
  async logOut() {
    try {
      this.isLoading = true;
      this.error = null;
      this.updateUI();
      
      await this.signOut(this.auth);
      
      this.isLoading = false;
      this.updateUI();
      return true;
    } catch (error) {
      this.isLoading = false;
      this.error = error.message;
      this.updateUI();
      return false;
    }
  }
  
  updateUI() {
    // Update loading state
    const loadingElements = document.querySelectorAll('.auth-loading');
    loadingElements.forEach(el => {
      el.style.display = this.isLoading ? 'inline-block' : 'none';
    });
    
    // Update buttons
    const authButtons = document.querySelectorAll('.auth-button');
    authButtons.forEach(button => {
      button.disabled = this.isLoading;
    });
    
    // Update error messages
    const errorElements = document.querySelectorAll('.auth-error');
    errorElements.forEach(el => {
      el.textContent = this.error || '';
      el.style.display = this.error ? 'block' : 'none';
    });
    
    // Update user-specific elements
    const userElements = document.querySelectorAll('.user-specific');
    userElements.forEach(el => {
      el.style.display = this.user ? 'block' : 'none';
    });
    
    const guestElements = document.querySelectorAll('.guest-specific');
    guestElements.forEach(el => {
      el.style.display = this.user ? 'none' : 'block';
    });
    
    // Update user info if available
    if (this.user) {
      const userEmailElements = document.querySelectorAll('.user-email');
      userEmailElements.forEach(el => {
        el.textContent = this.user.email;
      });
    }
  }
}

// Initialize auth when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.auth = new Auth();
}); 