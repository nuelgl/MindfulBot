// 1. NAVIGATION & INITIALIZATION
const startChatBtn = document.getElementById("start-chat-btn");
const landingPage = document.getElementById("landing-page");
const chatPage = document.getElementById("chat-page");
const clearBtn = document.getElementById("clear-btn");

startChatBtn.addEventListener("click", () => {
    landingPage.classList.add("hidden");
    chatPage.classList.remove("hidden");
    
    // Greet user only when they enter the chat interface
    if (chatBox.innerHTML === "") {
        addMessage("Hello! I'm MindfulBot. What's your name?", "bot");
    }
    userInput.focus(); 
});

// 2. KNOWLEDGE BASE: Mood Patterns & CBT Solutions
const moodPatterns = {
    happy: ["happy", "great", "good", "wonderful", "fantastic", "cheerful"],
    sad: ["sad", "unhappy", "crying", "low", "miserable", "down", "depressed"],
    anxious: ["anxious", "nervous", "worried", "panic", "on edge", "scared", "jittery"],
    stressed: ["stressed", "overwhelmed", "pressure", "burnt out", "too much", "exhausted"],
    lonely: ["lonely", "alone", "isolated", "nobody", "ignored", "left out"],
    angry: ["angry", "mad", "furious", "annoyed", "pissed", "irritated"],
    guilty: ["guilty", "my fault", "ashamed", "regret", "should have", "blame"],
    hopeless: ["hopeless", "no point", "give up", "wont get better", "lost", "despair"],
    bored: ["bored", "dull", "uninterested", "nothing to do", "empty", "monotonous"],
    confused: ["confused", "don't know", "unsure", "puzzled", "mixed signals", "lost"],
    tired: ["tired", "sleepy", "drained", "no energy", "lethargic", "fatigued"],
    excited: ["excited", "thrilled", "can't wait", "looking forward", "hyped", "energetic"],
    insecure: ["insecure", "not good enough", "failure", "ugly", "doubting", "low self-esteem"],
    grief: ["grief", "lost someone", "mourning", "miss them", "passed away", "heartbroken"],
    frustrated: ["frustrated", "fed up", "struggling", "not working", "difficult", "annoyed"],
    numb: ["numb", "nothing", "detached", "void", "hollow", "feelingless"],
    jealous: ["jealous", "envious", "wish i had", "not fair", "comparison", "covet"],
    overwhelmed: ["overwhelmed", "drowning", "too many things", "can't cope", "suffocating"],
    peaceful: ["peaceful", "calm", "relaxed", "content", "serene", "chill"],
    unloved: ["unloved", "unwanted", "rejected", "nobody cares", "hated", "alone"]
};

const responses = {
    happy: "That's great! To 'anchor' this feeling, write down one specific reason you feel good right now. This builds long-term positive neural pathways.",
    sad: "I'm sorry you're low. Try the '5-minute rule': perform one tiny physical task (like tidy your desk). Movement often helps break the cycle of sadness.",
    anxious: "Your nervous system is over-stimulated. Immediately try 'Box Breathing': Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Repeat 3 times to physically lower your heart rate.",
    stressed: "You have too many open 'mental tabs'. Write a 'Top 3' priority list and ignore everything else until those three are done. Focus creates calm.",
    lonely: "Loneliness is a signal for connection. Try a 'micro-connection': text a friend just to say hello or go to a public space like a cafe to be around people.",
    angry: "Anger is high physical energy. Process the adrenaline safely: go for a fast 5-minute walk or do 10 jumping jacks to release the tension.",
    guilty: "Distinguish between 'useful guilt' (fixing a mistake) and 'shame' (attacking yourself). If you can't fix it, write a letter of self-forgiveness and move forward.",
    hopeless: "When things feel dark, focus ONLY on immediate physical needs: Have you eaten? Are you hydrated? Start with these basic building blocks.",
    bored: "Boredom is a call for engagement. Try a '2-minute brain dump': write down every thought in your head to spark a new creative interest.",
    confused: "Confusion comes from over-information. Pick ONE path for the next 60 minutes. You don't need the whole map yet, just the next single step.",
    tired: "If you're mentally drained, turn off all screens. 15 minutes of sitting in a dark room with closed eyes is more effective than scrolling through your phone.",
    excited: "Channel that energy! Use this peak motivation to tackle a difficult task you've been avoiding. Your brain is currently primed for productivity.",
    insecure: "Comparison is usually the cause of insecurity. List three small things you accomplished this week. Your worth is inherent, not competitive.",
    grief: "Grief has no shortcut. Try 'pacing': allow yourself 15 minutes to feel the loss fully, then 15 minutes to focus on a routine task. One step at a time.",
    frustrated: "You're hitting a mental wall. Step away from the task for exactly 10 minutes. Physical distance from the problem creates mental clarity.",
    numb: "You're disconnected. Try 'sensory grounding': hold an ice cube in your hand or smell something strong like coffee to pull your focus back to the present.",
    jealous: "Jealousy is a compass showing you what you value. Use it to set one specific, achievable goal for your own growth today.",
    overwhelmed: "Stop looking at the mountain. Look at your feet. What is the ONE single thing you need to do in the next 60 seconds? Do only that.",
    peaceful: "This is the perfect time for reflection. Use this quiet mind to plan your week ahead while your perspective is clear and unbiased.",
    unloved: "Start with 'self-care' basics. Treat yourself to your favorite meal or a long shower. Demonstrate to yourself the care you are currently seeking.",
    crisis: "URGENT: Your safety is the priority. Please call a local emergency number or go to the nearest hospital immediately. Help is available 24/7.",
    default: "I hear you. To help me give you a specific solution, could you tell me what triggered this feeling?"
};

const crisisPatterns = ["suicide", "hurt myself", "end it all", "kill", "die", "harm myself"];
const gratitudePatterns = ["thank", "thanks", "grateful", "appreciate", "helpful", "good bot"];
const greetingPatterns = ["hello", "hi", "hey", "greetings", "morning", "afternoon"];
const farewellPatterns = ["no", "nothing", "bye", "goodbye", "that's all", "quit", "stop", "no thanks", "no thank you"];

// 3. STATE & DOM ELEMENTS
let userName = ""; 
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");

// 4. CORE CHAT LOGIC
function addMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender === "user" ? "user-msg" : "bot-msg");
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(input) {
    // 0. DATA CLEANING: Remove punctuation (! . ? , ') and trim whitespace
    // This ensures "No." becomes "no" so the bot recognizes it.
    const lowerInput = input.toLowerCase().replace(/[.!?,']/g, "").trim();

    // 1. Priority 1: Crisis Check
    if (crisisPatterns.some(word => lowerInput.includes(word))) {
        return responses.crisis;
    }

    // 2. Immediate Farewell Check (The "Short Circuit")
    // Note: apostrophes removed from "thats all" and "im fine" to match cleaned input
    const strictFarewell = ["no", "nothing", "bye", "goodbye", "thats all", "stop", "im fine"];
    if (strictFarewell.includes(lowerInput)) {
        return userName ? 
            `I understand, ${userName}. Take care of yourself. I'm here whenever you need to talk again.` : 
            "I understand. Take care of yourself. I'm here whenever you need to talk again.";
    }

    // 3. Social: Greeting Check
    if (greetingPatterns.some(word => lowerInput.startsWith(word))) {
        return userName ? 
            `Hello again, ${userName}! How can I help you with your feelings right now?` : 
            "Hello! I'm MindfulBot. What is your name?";
    }

    // 4. Politeness: Gratitude Check
    if (gratitudePatterns.some(word => lowerInput.includes(word))) {
        return userName ? 
            `You're very welcome, ${userName}. I'm glad I could offer a solution. Is there anything else on your mind?` : 
            "You're very welcome. I'm glad I could help. Is there anything else you'd like to discuss?";
    }

    // 5. Identity: Name Detection (MOBILE OPTIMIZED)
    if (!userName) {
        // This Regex replaces "i'm", "i’m" (curly), and "im" with "i am"
        const mobileFriendlyInput = lowerInput.replace(/i['’]?m\s+/g, "i am ");
        
        let nameMatch = "";
        if (mobileFriendlyInput.includes("my name is ")) {
            nameMatch = mobileFriendlyInput.split("my name is ")[1];
        } else if (mobileFriendlyInput.includes("i am ")) {
            nameMatch = mobileFriendlyInput.split("i am ")[1];
        }

        if (nameMatch) {
            userName = nameMatch.trim();
            // Capitalize for professional display
            userName = userName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            return `Nice to meet you, ${userName}! How are you feeling today?`;
        }
    }

    // 6. Multi-Mood Aggregator
    let detectedMoods = [];
    for (let mood in moodPatterns) {
        if (moodPatterns[mood].some(word => lowerInput.includes(word))) {
            detectedMoods.push(responses[mood]);
        }
    }

    if (detectedMoods.length > 0) {
        let finalReply = detectedMoods.join(" ");
        return userName ? `${userName}, ${finalReply}` : finalReply;
    }

    // 7. Fallback (Only happens if 1-6 fail)
    return responses.default;
}

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";
    typingIndicator.classList.remove("hidden");

    setTimeout(() => {
        try {
            const reply = getBotResponse(text);
            addMessage(reply, "bot");
        } catch (e) {
            console.error("Critical Error:", e);
            addMessage("I'm here for you. Tell me more about what is on your mind.", "bot");
        } finally {
            typingIndicator.classList.add("hidden"); 
        }
    }, 1000);
}

// 5. EVENT LISTENERS
sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSend(); });

clearBtn.addEventListener("click", () => {
    chatBox.innerHTML = "";
    userName = ""; 
    addMessage("Chat cleared. Hello! I'm MindfulBot. What's your name?", "bot");
    userInput.focus();
});
// Help Modal Logic
const helpBtn = document.getElementById("help-btn");
const helpModal = document.getElementById("help-modal");
const closeHelp = document.getElementById("close-help");

helpBtn.addEventListener("click", () => {
    helpModal.classList.remove("hidden");
});

closeHelp.addEventListener("click", () => {
    helpModal.classList.add("hidden");
});

// Close modal if user clicks outside of the box
window.addEventListener("click", (e) => {
    if (e.target === helpModal) {
        helpModal.classList.add("hidden");
    }
});