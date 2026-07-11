// Splash screen management
document.addEventListener('DOMContentLoaded', function() {
  const splashScreen = document.getElementById('splash-screen');
  
  // Hide splash screen after app loads
  function hideSplashScreen() {
    if (splashScreen) {
      splashScreen.style.opacity = '0';
      splashScreen.style.transition = 'opacity 0.5s ease-out';
      
      setTimeout(() => {
        splashScreen.style.display = 'none';
      }, 500);
    }
  }
  
  // Auto-hide after 3 seconds or when app is ready
  setTimeout(hideSplashScreen, 3000);
  
  // You can also call hideSplashScreen() when your app is fully loaded
  // window.addEventListener('load', hideSplashScreen);
});