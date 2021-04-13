//run functions
fetchQuotes()
setUpForm()
//declare functions
//function hoisting
function fetchQuotes(){
    //make fetch and render each quote
    console.log('we should make our fetch to get qyotes')
    fetch('http://localhost:3000/quotes?_embed=likes') //inital GET Request
    .then(response => response.json()) //implicitly return the json format of our response
    .then(quotesData => {
        //now we can mainpulate the DOM with access to our data from server
        // console.log(quotesData)
        quotesData.forEach(quote => renderQuote(quote))
        // quotesData.forEach(renderQuote)
    })
}

function renderQuote(quote){
    //handle DOM manipulation for every quote
    console.log(quote)
    //find where quotes go on INDEX
    const quotesContainer = document.getElementById('quote-list')

    //structure of a single quote 
//     <li class='quote-card'>
//     <blockquote class="blockquote">
//       <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
//       <footer class="blockquote-footer">Someone famous</footer>
//       <br>
//       <button class='btn-success'>Likes: <span>0</span></button>
//       <button class='btn-danger'>Delete</button>
//     </blockquote>
//     </li>

    //create necessary elements 
    const li = document.createElement('li') // <li></li>
    const blockquote = document.createElement('blockquote') // <blockquote></blockquote>
    const p = document.createElement('p') // <p></p>
    const footer = document.createElement('footer') // <footer></footer>
    const buttonLike = document.createElement('button') // <button></button>
    const buttonDelete = document.createElement('button') // <button></button>
    const br = document.createElement('br') // <br></br>

    //change properties 
    li.className = 'quote-card'
    blockquote.className = 'blockquote'
    p.className = 'mb-0'
    p.innerText = quote.quote
    footer.className = 'blockquote-footer'
    footer.innerText = quote.author
    buttonLike.className = 'btn-success'
    buttonLike.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    buttonLike.setAttribute('id', `quoteLikes${quote.id}`)
    
    buttonLike.addEventListener('click',()=>{
        //when like button is clicked
        //to express  likes, we create a  like 
        // buttonLike.innerHTML = `Likes: <span>${++quote.likes.length}</span>`
        createLike(quote)

    })

    buttonDelete.className = 'btn-danger'
    buttonDelete.innerText = 'Delete'

    buttonDelete.addEventListener('click', ()=> {
        //when  delete button clicked
        //send delete request
        console.log('find quote id', quote.id)
        fetch(`http://localhost:3000/quotes/${quote.id}`,{
            method: 'DELETE'
        })
        //remove this whole element
        li.remove()
    })

    //append DOM elements
    li.append(blockquote)
    blockquote.append(p, footer, br, buttonLike, buttonDelete)


    //append to existing element on page
    quotesContainer.append(li)
} //end of renderquote function

function setUpForm(){
    console.log('grab form and give it an eventListener')
    // grab  form
    const form = document.querySelector('#new-quote-form')
    // give it eventListner
    form.addEventListener('submit', (e)=>{
        e.preventDefault() //no refreshes
        console.log('submitting')

        //get form input values
        // const newQuote = e.target['new-quote'].value //works
        // const newQuote = e.target[0].value //works too
        const newQuote = document.getElementById('new-quote').value
        const newAuthor = e.target[1].value
        // console.log(newQuote)
        // console.log(newAuthor)
        createNewQuote(newQuote, newAuthor)
    })
    // delegate the callback function

} //end of setUpForm function

function createNewQuote(newQuote, newAuthor){
    //POST request for a new quote
    // console.log(newQuote, newAuthor)

    // format data 
    const newQuoteObject = {
        quote: newQuote,
        author: newAuthor
    }
    // create option object
    const optionsObject = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify(newQuoteObject)
    }
    //make POST request 
    fetch('http://localhost:3000/quotes', optionsObject)
    .then(res=>res.json())
    // then after
    .then(postedQuote => {
        postedQuote.likes = []
        renderQuote(postedQuote)
    })
    // render new quote
}

function createLike(quote){
    console.log('THIS quote gets a like', quote)

    //format data 
    const newLike = {
        quoteId: quote.id,
        createdAt: Date.now()
    }

    //create my options object 
    const optionsObject ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newLike)
    }

    //make fetch request(POST)
    fetch(`http://localhost:3000/likes`, optionsObject)
    .then(res=>res.json())
    .then(data => {
        //update array 
        // quote.likes.push(data)
        //use event passed
        //e.target.childNode[0].data = `Likes: <span>${quote.likes.length}</span>`
    })

    //then reflect changes to DOM
}