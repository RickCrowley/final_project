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
    document.querySelector('.sign-out').insertAdjacentHTML('beforeend',
    `<a href="#" class="text-lg sign-out button bg-gray-500 hover:bg-black border-black text-white rounded px-2">Sign Out</a>`)
    
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

    // Actions for clicking on the Add to do the Shelves button
    document.querySelector(`#add`).addEventListener('click', function(event){
      event.preventDefault()
      document.querySelector('.tag-line').classList.add('hidden')
      document.querySelector('.add-form').insertAdjacentHTML('beforeend',`
      <form class="container-center w-full mt-8">
        <select id="category" name="category" placeholder="Category"
          class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500">
          <option value="none">None</option>
          <option value="american">American Whiskey</option>
          <option value="blended">Blended</option>
          <option value="bourbon">Bourbon</option>
          <option value="canadian">Canadian</option>
          <option value="independent">Independent</option>
          <option value="irish">Irish</option>
          <option value="japanese">Japanese</option>
          <option value="rye">Rye</option>
          <option value="scotch">Scotch</option>
          </select>
        <input type="text" id="image-url" name="image-url" placeholder="Image URL"
          class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500">
        <input type="text" id="price" name="price" placeholder="Suggested Value"
          class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500">
        <input type="text" style="width:780px; height:100px;" id="description" name="description" placeholder="Brief Description"
          class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500">
        <button class="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-xl">Add</button>
      </form>
      `)
      // Listen for the form submit and create/render the new post
      document.querySelector('.add-form').addEventListener('submit', async function (event) {
        event.preventDefault()
        let userId = user.uid
        let postCategory = document.querySelector('#category').value
        let postImageUrl = document.querySelector('#image-url').value
        let postUsername = user.displayName
        let postDescription = document.querySelector('#description').value
        let postValue = document.querySelector('#price').value
        let addResponse = await fetch(`/.netlify/functions/add`, {
          method: 'POST',
          body: JSON.stringify({
            userId: userId,
            username: postUsername,
            imageUrl: postImageUrl,
            category: postCategory,
            value: postValue,
            description: postDescription
          })
        })
        let post = await addResponse.json()
        
        document.querySelector('#image-url').value = ''
        document.querySelector('#category').value = ''
        document.querySelector('#description').value = ''
        document.querySelector('#price').value = ''
        renderPost(post)
      })
    },{once:true})

    // Actions for clicking on the Browse the Shelves button
    document.querySelector(`#browse`).addEventListener('click', async function(event){
      event.preventDefault()
      document.querySelector('.add-form').innerHTML = ""
      let browseResponse = await fetch(`/.netlify/functions/browse`)
      let posts = await browseResponse.json()
      for (let i=0; i<posts.length; i++) {
        let post = posts[i]
        renderPost(post)
      }
      
    },{once:true})
    // Actions for clicking on the View My Bar button
    document.querySelector('#my-bar').addEventListener('click', async function(event) {
      event.preventDefault()
      let currentUser = firebase.auth().currentUser
      let barResponse = await fetch(`/.netlify/functions/browse`)
      let posts = await barResponse.json()
      for (let i=0; i<posts.length; i++) {
        let post = posts[i]
        // let postUser = posts.
        // let docRef = await db.collection('interested').doc(`${post.id}-${currentUser.uid}`).get()
        // let interested = docRef.data()
        // let opacityClass = ''
        // if (interested) {
        //   opacityClass = 'opacity-20'
        // }
        // console.log(currentUser.uid)
        // console.log(post.userid)
        if (currentUser.uid == post.userid) {
          renderPost(post)
        }          
      }
    },{once:true})
    // Add event listener for Interested Button
 
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

// Define the renderPost function
async function renderPost(post) {
  let postId = post.id  
  document.querySelector('.browse-list').insertAdjacentHTML('beforeend', `
    <div class="post-${postId} p-4 w-full md:w-1/2 lg:w-1/3">

      <div class="md:mx-0 mx-4">
        <span class="font-bold capitalize text-white text-xl">${post.category}</span>
      </div>

      <div>
        <img src="${post.imageUrl}" class="bg-white h-1/3; w-1/3">
      </div>
      
      <div class="md:mx-0 mx-4">
        <span class="font-bold text-white text-xl">${post.username}</span>
      </div>

      <div class="md:mx-0 mx-4 w-1/3">
        <span class="font-bold text-white text-lg">${post.description}</span>
      </div>

      <div class="md:mx-0 mx-4">
        <span class="font-bold text-white text-lg">${post.value}</span>
      </div>

      <button class="interested-button bg-gray-500 hover:bg-black text-white px-2 rounded-xl">Interested!</button>
            
    </div>
  `)
}
