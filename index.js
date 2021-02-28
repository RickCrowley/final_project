firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in
    console.log('signed in')

    document.querySelector('.sign-in-or-sign-out').innerHTML = `
    <p>Welcome ${user.displayName}</p>
    <a href="#" class = "sign-out text-blue-500 underline">Sign Out</a>
  `
  document.querySelector('.sign-out').addEventListener('click', function(event) {
    event.preventDefault()
    firebase.auth().signOut()
    document.location.href = 'index.html'
  })

  
  } else {
    // Signed out
    console.log('signed out')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'index.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})
