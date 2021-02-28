firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in
    let db = firebase.firestore()
    console.log('signed in')

    db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email
    })
    
    //Need to figure out how to make the Sign Out button align to the right
    document.querySelector('.page-top').insertAdjacentHTML('beforeend',
    `<a href="#" class="text-lg sign-out button border-2 bg-black border-black text-white rounded px-2">Sign Out</a>`)
    
    // Display upon Sign-in
    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <div class="container-center text-xl">
        <p class="m-12">Welcome ${user.displayName}</p>
        <p class="m-12">What would you like to do today?</p>
      </div>
    `
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      event.preventDefault()
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })

    // Action for clicking on the Add to do the Shelves button
    document.querySelector(`#add`).addEventListener('click', function(event){
      event.preventDefault()
      document.querySelector('.tag-line').classList.add('hidden')
      document.querySelector('.add-form').insertAdjacentHTML('beforeend',`
      <form class="w-full mt-8">
        <input type="text" id="category" name="category" placeholder="Category"
          class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500">
        <input type="text" id="image-url" name="image-url" placeholder="Image URL"
          class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500">
        <input type="text" id="price" name="price" placeholder="Suggested Value"
          class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500">
        <input type="text" id="description" name="description" placeholder="Brief Description"
          class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500">
        <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl">Post</button>
      </form>
      `)
    })
 
  } else {
    // Signed out
    console.log('signed out')

    document.querySelector(`#browse`).classList.add('hidden')
    document.querySelector(`#add`).classList.add('hidden')
    document.querySelector(`#my-bar`).classList.add('hidden')

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
