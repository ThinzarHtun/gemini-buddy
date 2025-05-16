// // const inputText = document.getElementById("userInput")
// const btn = document.getElementById('submit')
// const geminiResponseContainer = document.getElementById('geminiResponse')


// btn.addEventListener('click', async () => {
//     const inputText = document.getElementById("userInput")
//     const userQuery = inputText.value.trim()
//     console.log(userQuery)
//     try {
//         // Use fetch to send the data to your backend
//         const response = await fetch('/gemini', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ userQuery }),
//         });

//         if (!response.ok) {
//         //   geminiResponseContainer.textContent = response.status
//           throw new Error('Network response was not ok: ' + response.status);
//         }

//         // Get the response text (or JSON if your server returns JSON)
//         const data = await response.json()
//         geminiResponseContainer.textContent = data
//         // console.log(typeof data)
//         // console.log(JSON.parse(response))

//       } catch (error) {
//         console.error('Error during fetch:', error);
//         alert('Error: ' + error.message);
//       }
// })

const btn = document.getElementById('submit');
const geminiThread = document.getElementById('thread');

function createTweet(author, text, isUser = false) {
  const tweet = document.createElement('div');
  tweet.className = 'tweet ' + (isUser ? 'user-tweet' : 'gemini-reply');

  const avatar = document.createElement('div');
  avatar.className = 'avatar';

  const content = document.createElement('div');
  content.className = 'tweet-content';

  const authorElem = document.createElement('div');
  authorElem.className = 'tweet-author';
  authorElem.textContent = author;

  const textElem = document.createElement('div');
  textElem.className = 'tweet-text';
  textElem.textContent = text;

  content.appendChild(authorElem);
  content.appendChild(textElem);

  // Both are on the same side (avatar on left)
  tweet.appendChild(avatar);
  tweet.appendChild(content);

  return tweet;
}



btn.addEventListener('click', async () => {
  const inputText = document.getElementById("userInput");
  const userQuery = inputText.value.trim();
  if (!userQuery) return;

  inputText.value = '';

  geminiThread.appendChild(createTweet("You", userQuery, true));

  try {
    const response = await fetch('/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userQuery }),
    });

    if (!response.ok) throw new Error('Network error: ' + response.status);

    const data = await response.json();
    const reply = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    geminiThread.appendChild(createTweet("Gemini", reply));
    geminiThread.scrollTop = geminiThread.scrollHeight;
  } catch (err) {
    console.error(err);
    geminiThread.appendChild(createTweet("Gemini", "Error: " + err.message));
  }
});
