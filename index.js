firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
    // Signed in
    // let db = firebase.firestore()
    console.log('signed in')

    // db.collection('users').doc(user.uid).set({
    //   name: user.displayName,
    //   email: user.email
    // })

  

    // Display upon Sign-in
    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <div style="padding: 8px; border: 2px; margin: 50px; background-color:rgba(255, 255, 255, 0.753);">
        <p class="text-2xl text-black font-bold">Welcome ${user.displayName}!</p>
        <p class="text-2xl text-black font-bold">What would you like to do today:</p>
      </div>
    `
    

    // Actions for clicking the Sign Out button 
    document.querySelector(`#sign-out`).addEventListener('click', function (event) {
      event.preventDefault()
      document.querySelector('.sign-out').innerHTML = ""
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })
    // Actions for clicking on the Add to do the Shelves button
    document.querySelector(`#add`).addEventListener('click', function (event) {
      event.preventDefault()
      document.querySelector('.browse-list').innerHTML = ""
      document.querySelector('.add-form').innerHTML = ""
      document.querySelector('.add-form').insertAdjacentHTML('beforeend', `
        <form class="w-full mt-8">
          <select id="category" name="category" placeholder="Category"
            class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-gray-500 focus:border-gray-500">
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
            class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-gray-500 focus:border-gray-500">
          <input type="text" id="price" name="price" placeholder="Suggested Value"
            class="my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-gray-500 focus:border-gray-500">
          <input type="text" id="description" name="description" placeholder="Brief Description"
            class="block w-1/2 h-16 flex-shrink my-2 p-2 w-64 border border-gray-400 rounded shadow-xl focus:outline-none focus:ring-gray-500 focus:border-gray-500">
          <button class="block bg-gray-800 hover:bg-gray-500 border border-gray-500 text-white px-4 py-2 rounded-xl">Add</button>
        </form>
      `)
      // Listen for the form submit and create/render the new post
      document.querySelector('.add-form').addEventListener('submit', async function (event) {
        event.preventDefault()
        document.querySelector('.browse-list').innerHTML = ""

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
    })

    // Actions for clicking on the Browse the Shelves button
    document.querySelector(`#browse`).addEventListener('click', async function (event) {
      event.preventDefault()
      document.querySelector('.browse-list').innerHTML = ""
      document.querySelector('.add-form').innerHTML = ""
      let browseResponse = await fetch(`/.netlify/functions/browse`)
      let posts = await browseResponse.json()
      for (let i = 0; i < posts.length; i++) {
        let post = posts[i]
        renderPost(post)

        // Add event listener for Interested Button
        let postId = post.id
        document.querySelector(`.interested-button-${postId}`).addEventListener('click', async function (event) {
          document.querySelector(`.interested-button-${postId}`).innerHTML = ""

          let userId = user.uid
          let currentUser = firebase.auth().currentUser

          //Need to stop the Interested Button from occuring multiple times
          if (currentUser.uid == post.userid) {
            // document.querySelector(`.interested-${postId}`).innerHTML = ""
            document.querySelector(`.interested-${postId}`).insertAdjacentHTML('beforeend', `
              <div class="text-black">
                Already in your Bar!
              </div>
            `)
          } else {
            document.querySelector(`.interested-${postId}`).insertAdjacentHTML('beforeend', `
              <div class="text-black">
                Added to your Bar!
              </div>
            `)
            let browseResponse = await fetch(`/.netlify/functions/browse`)
            let posts = await browseResponse.json()
            let post = posts[i]
            let userId = user.uid
            let postCategory = post.category
            let postImageUrl = post.imageUrl
            let postUsername = post.username
            let postDescription = post.description
            let postValue = post.value
            // let origPostId = post.id
            let ineterestedResponse = await fetch(`/.netlify/functions/interested`, {
              method: 'POST',
              body: JSON.stringify({
                origPostId: postId,
                userId: userId,
                username: postUsername,
                imageUrl: postImageUrl,
                category: postCategory,
                value: postValue,
                description: postDescription
              })
            })


          }
        })
      }
    })
    // Actions for clicking on the View My Bar button
    document.querySelector('#my-bar').addEventListener('click', async function (event) {
      event.preventDefault()
      document.querySelector('.browse-list').innerHTML = ""
      document.querySelector('.add-form').innerHTML = ""
      let currentUser = firebase.auth().currentUser
      let barResponse = await fetch(`/.netlify/functions/browse`)
      let posts = await barResponse.json()
      for (let i = 0; i < posts.length; i++) {
        let post = posts[i]
        let postId = post.id

        if (currentUser.uid == post.userid) {
          renderPost(post)
          document.querySelector(`.interested-button-${postId}`).innerHTML = ""
        }
      }
    })
    document.querySelector('#my-bar').addEventListener('click', async function (event) {
      event.preventDefault()
      document.querySelector('.browse-list').innerHTML = ""
      document.querySelector('.add-form').innerHTML = ""
      let currentUser = firebase.auth().currentUser
      let interestedResponse = await fetch(`/.netlify/functions/find_interested`)
      let interested = await interestedResponse.json()
      for (let i = 0; i < interested.length; i++) {
        let interestedPost = interested[i]
        let postId = interestedPost.id
        
        if (currentUser.uid == interestedPost.userid) {
          renderPost(interestedPost)
          document.querySelector(`.interested-button-${postId}`).innerHTML = ""
        }
      }
    })  
    

  } else {
    // Signed out
    // console.log('signed out')

    document.querySelector(`#browse`).classList.add('hidden')
    document.querySelector(`#add`).classList.add('hidden')
    document.querySelector(`#my-bar`).classList.add('hidden')
    document.querySelector(`#sign-out`).classList.add('hidden')

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
    <div class="post-${postId} space-x-4 p-4 bg-gray-200 border border-white md:w-1/2 lg:w-1/3">

      <div class="md:mx-0 mx-4 text-center font-bold capitalize text-black text-xl">
        <span>${post.category}</span>
      </div>

      <center>
        <img src="${post.imageUrl}" class="bg-rgba(255, 255, 255, 0.753)" style="width:250px; height: 300px; object-fit:cover;">
      </center>
      
      <div class="md:mx-0 mx-4 text-center font-bold capitalize text-black text-xl">
        <span>${post.username}</span>
      </div>

      <div class="md:mx-0 mx-4 text-center font-bold capitalize text-black text-xl">
        <span class="font-bold text-black text-lg">${post.description}</span>
      </div>

      <div class="md:mx-0 mx-4 text-center font-bold capitalize text-black text-xl">
        <span class="font-bold text-black text-lg">${post.value}</span>
      </div>

      <div class="text-center interested-${postId}">
        <button class="interested-button-${postId} bg-gray-800 hover:bg-gray-500 border-gray-500 text-white px-2 rounded-xl">Interested!</button>
      </div>            
    </div>
  `)
}

