const chatInput = document.querySelector(".chat-input textarea");
        const sendChatBtn = document.querySelector(".chat-input span");
        const chatbox = document.querySelector(".chatbox");
        const chatbotToggler = document.querySelector(".chatbot-toggler");
        const chatbotCloseBtn = document.querySelector(".close-btn");

        let userMessage;
        const API_KEY ="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";
        const InputIniHeight = chatInput.scrollHeight;

        const createChatLi = (message, className)=>{
            // create a chat <li> element with passed message and classname
            const chatLi = document.createElement("li");
            chatLi.classList.add("chat", className);
            let chatContent = className === "outgoing"? `<p></p>` : `<span class="material-symbols-outlined">🙋</span><p></p>`;
            chatLi.innerHTML = chatContent;
            chatLi.querySelector("p").textContent = message;
            return chatLi;
        }

            const generateResponse= (incomingChatLi) =>{
                const API_URL = "https://api.openai.com/v1/chat/completions";
                const messageElement = incomingChatLi.querySelector("p");
                const requestOptions = {
                    method : "POST",
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${API_KEY}`
                    },
                    body:JSON.stringify({
                        "model": "gpt-3.5-turbo",
                        "messages": [{role: "user", content: userMessage}]
                    })
                }
                fetch(API_URL , requestOptions).then(res => res.json()).then(data => {
                    messageElement.textContent= data.choices[0].message.content;
                }).catch((error) => {
                    messageElement.classList.add("error");
                    messageElement.textContent="Oops! Something went wrong. Please Check your network.";
                }).finally(() => chatbox,scroll(0, chatbox.scrollHeight));
            }
        const handleChat= () =>{
            userMessage = chatInput.value.trim();
            console.log(userMessage);
            if(!userMessage)return;
            chatInput.value = "";
            chatInput.style.height = `$(InputIniHeight)px`;

            // append the user message to the chatbox
            chatbox.appendChild(createChatLi(userMessage, "outgoing"));
            chatbox.scroll(0, chatbox.scrollHeight);

            setTimeout(() => {
                //Display "typing" message while waiting for the response.
                const incomingChatLi = createChatLi("Typing...", "incoming")
                chatbox.appendChild(incomingChatLi);
                chatbox.scroll(0, chatbox.scrollHeight);
                generateResponse(incomingChatLi);
            },1000 )
        }
        
        chatInput.addEventListener("input", () =>{
            //Adjust the height of the input textarea based on its content.
            chatInput.style.height = `$(InputIniHeight)px`;
            chatInput.style.height = `$(chatInput.scrollHeight)px`;
        });

        chatInput.addEventListener("keydown", (e) =>{
           if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
            e.preventDefault();
            handleChat();
           }
        });

        sendChatBtn.addEventListener("click", handleChat);
        chatbotToggler.addEventListener("click",() => 
        document.body.classList.toggle("show-chatbot"));
        chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));